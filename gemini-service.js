function cleanGeminiResponse(rawText) {
  if (!rawText) return "";
  let cleaned = rawText.trim();

  // 1. Strip thought tags from reasoning models if present
  cleaned = cleaned.replace(/<thought>[\s\S]*?<\/thought>/gi, "").trim();

  // 2. Strip code blocks that contain drafts / internal reasoning
  cleaned = cleaned.replace(/```(?:plaintext|text|markdown)?\s*[\s\S]*?(?:Draft\s*\d|Greeting:|Warmth:|Engagement:)[\s\S]*?```/gi, "").trim();

  // 3. Strip drafting / reasoning preambles
  if (cleaned.includes("Drafting response:")) {
    const parts = cleaned.split("Drafting response:");
    cleaned = parts[parts.length - 1].trim();
  }

  // 4. Strip lines that start with internal meta notes or draft bullet points
  const lines = cleaned.split("\n");
  const filteredLines = [];
  let skippingPreamble = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // Check if line is a meta thought / draft note
    const isMeta = 
      /^\*?\s*\*?Draft\s*\d/i.test(line) ||
      /^\*?\s*\*?(Greeting|Warmth|Engagement|Persona|Objective|Context|Analysis|Observation):/i.test(line) ||
      /^["'].*?["']\s*(\w+)?\s*\(from memory\)/i.test(line) ||
      (/^\(.*?\)$/.test(line) && /too robotic|discard|better|sol-style/i.test(line));

    if (isMeta) {
      continue;
    }

    if (skippingPreamble) {
      // If line is meta summary like '"hi Sol" Adrian (from memory)...' or internal reasoning
      if (line.includes("(from memory)") || (line.includes("Authentic, warm, natural") && line.includes("robotic"))) {
        continue;
      }
      if (line === "") {
        continue;
      }
      skippingPreamble = false;
    }

    filteredLines.push(lines[i]);
  }

  cleaned = filteredLines.join("\n").trim();

  // 5. If the response contains a quoted draft followed immediately by the same unquoted text:
  const quoteMatch = cleaned.match(/^"([^"]+)"\s*\n+([\s\S]+)$/);
  if (quoteMatch) {
    const quoted = quoteMatch[1].trim();
    const rest = quoteMatch[2].trim();
    if (quoted === rest || rest.includes(quoted)) {
      cleaned = rest;
    }
  }

  return cleaned || rawText.trim();
}

export class GeminiService {
  constructor() {
    this.apiKey = localStorage.getItem("gemini_api_key") || "";
    this.genAI = null;
    this.hasPlatformKey = false;
    this.platformModel = "gemini-3.6-flash";
    this.initGenAI();
    this.checkPlatformStatus();
  }

  async checkPlatformStatus() {
    try {
      const resp = await fetch("/api/config/gemini-status");
      if (resp.ok) {
        const data = await resp.json();
        this.hasPlatformKey = !!data.active;
        if (data.model) this.platformModel = data.model;
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("sol_platform_status_updated", { detail: data }));
        }
        return data;
      }
    } catch (e) {
      console.warn("Could not query platform gemini status:", e);
    }
    return { active: false };
  }

  async initGenAI() {
    if (this.apiKey) {
      try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        this.genAI = new GoogleGenerativeAI(this.apiKey);
      } catch (e) {
        console.error("Failed to load Gemini SDK:", e);
      }
    }
  }

  async setApiKey(key) {
    this.apiKey = key.trim();
    if (this.apiKey) {
      localStorage.setItem("gemini_api_key", this.apiKey);
      try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        this.genAI = new GoogleGenerativeAI(this.apiKey);
      } catch (e) {
        console.error("Failed to load Gemini SDK:", e);
      }
    } else {
      localStorage.removeItem("gemini_api_key");
      this.genAI = null;
    }
  }

  hasApiKey() {
    return !!this.apiKey || this.hasPlatformKey;
  }

  async getSupportedModels() {
    if (!this.apiKey) return [];
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(this.apiKey)}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok && data.models && Array.isArray(data.models)) {
        const supported = data.models
          .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"))
          .map(m => m.name.replace(/^models\//, ""));
        return supported;
      }
    } catch (e) {
      console.warn("Could not query model discovery endpoint:", e);
    }
    return [];
  }

  async fetchGeminiDirect(modelName, messages, systemInstruction, onChunk, onComplete) {
    const formattedContents = messages
      .filter(m => m.role === "user" || m.role === "model")
      .map(m => {
        const text = m.content || (m.parts && m.parts[0] ? m.parts[0].text : "");
        return {
          role: m.role === "model" ? "model" : "user",
          parts: [{ text: text }]
        };
      });

    const bodyData = {
      contents: formattedContents
    };
    if (systemInstruction && systemInstruction.trim()) {
      bodyData.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    // 1. Build prioritized model candidate list
    // NEVER put thinking models ahead of fast conversational production models!
    const preferredOrder = [
      modelName,
      "gemini-3.6-flash",
      "gemini-3.5-flash-lite",
      "gemini-2.5-flash"
    ].filter(Boolean);

    let discovered = await this.getSupportedModels();
    // Exclude thinking models so they don't dump chain-of-thought drafts
    const nonThinkingDiscovered = discovered.filter(m => !m.toLowerCase().includes("thinking") && m !== "gemini-pro");

    const modelsToTry = [];
    for (const m of [...preferredOrder, ...nonThinkingDiscovered]) {
      if (m && !modelsToTry.includes(m) && m !== "gemini-pro") {
        modelsToTry.push(m);
      }
    }

    let lastError = null;
    for (const mId of modelsToTry) {
      const url = this.apiKey.startsWith("AQ.")
        ? `https://generativelanguage.googleapis.com/v1beta/models/${mId}:generateContent`
        : `https://generativelanguage.googleapis.com/v1beta/models/${mId}:generateContent?key=${encodeURIComponent(this.apiKey)}`;

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "x-goog-api-key": this.apiKey
          },
          body: JSON.stringify(bodyData)
        });

        const data = await response.json();
        if (response.ok && data.candidates && data.candidates[0] && data.candidates[0].content) {
          const parts = data.candidates[0].content.parts || [];
          // Filter out internal thought parts (Gemini 2.0 returns thought: true on reasoning parts)
          const validParts = parts.filter(p => !p.thought);
          const rawReply = (validParts.length > 0 ? validParts : parts)
            .map(p => p.text || "")
            .join("\n");
          const replyText = cleanGeminiResponse(rawReply);
          
          // Stream words out smoothly
          const words = replyText.split(" ");
          for (let i = 0; i < words.length; i += 3) {
            const chunk = words.slice(i, i + 3).join(" ") + " ";
            onChunk(chunk);
            await new Promise(r => setTimeout(r, 20));
          }
          if (onComplete) onComplete(replyText);
          return true;
        } else if (data.error) {
          lastError = new Error(data.error.message || `API error ${data.error.code}`);
        }
      } catch (err) {
        lastError = err;
      }
    }
    throw lastError || new Error("Failed to connect to Google Gemini API.");
  }

  async fetchGeminiPlatformProxy(modelName, messages, systemInstruction, onChunk, onComplete) {
    const formattedContents = messages
      .filter(m => m.role === "user" || m.role === "model")
      .map(m => {
        const text = m.content || (m.parts && m.parts[0] ? m.parts[0].text : "");
        return {
          role: m.role === "model" ? "model" : "user",
          parts: [{ text: text }]
        };
      });

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: formattedContents,
        systemInstruction: systemInstruction,
        model: modelName || this.platformModel || "gemini-3.6-flash"
      })
    });

    const data = await response.json();
    if (!response.ok || !data.reply) {
      throw new Error(data.error || `Platform AI returned status ${response.status}`);
    }

    const replyText = cleanGeminiResponse(data.reply);
    const words = replyText.split(" ");
    for (let i = 0; i < words.length; i += 3) {
      const chunk = words.slice(i, i + 3).join(" ") + " ";
      onChunk(chunk);
      await new Promise(r => setTimeout(r, 20));
    }
    if (onComplete) onComplete(replyText);
    return true;
  }

  async generateDirectTitle(userQuery, aiReply = "") {
    const prompt = `Based on this initial conversation exchange:
User: "${(userQuery || "").slice(0, 160)}"
${aiReply ? `AI: "${aiReply.slice(0, 160)}"` : ""}

Generate a short, natural, descriptive 2-to-4 word title for this conversation.
Rules:
- 2 to 4 words only.
- No punctuation, quotes, or markdown.
- Capitalize like a title (e.g. "Spanish Verb Conjugation", "Daily Practice Routine").
- Return ONLY the title words and nothing else.`;

    if (this.apiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(this.apiKey)}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 16, temperature: 0.3 }
          })
        });
        const data = await response.json();
        if (response.ok && data.candidates && data.candidates[0] && data.candidates[0].content) {
          const parts = data.candidates[0].content.parts || [];
          const text = parts[0]?.text || "";
          const clean = text.replace(/["'`*\n\r]/g, "").replace(/^title:\s*/i, "").trim();
          if (clean && clean.length >= 2 && clean.length <= 40) {
            return clean;
          }
        }
      } catch (e) {
        console.warn("Direct title generation failed:", e);
      }
    } else if (this.hasPlatformKey) {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: prompt }],
            model: "gemini-3.6-flash",
            isTitle: true
          })
        });
        const data = await response.json();
        if (response.ok && data.reply) {
          const clean = data.reply.replace(/["'`*\n\r]/g, "").replace(/^title:\s*/i, "").trim();
          if (clean && clean.length >= 2 && clean.length <= 40) {
            return clean;
          }
        }
      } catch (e) {
        console.warn("Platform title generation failed:", e);
      }
    }
    return "";
  }

  getActiveUserContext() {
    let userName = "Guest";
    let isGuest = true;
    try {
      const savedProfile = localStorage.getItem("sol_user_profile");
      if (savedProfile) {
        const p = JSON.parse(savedProfile);
        if (p && p.name) {
          userName = p.name.split(" ")[0];
          isGuest = false;
        }
      }
    } catch (e) {}
    return { userName, isGuest };
  }

  getTrainingProfile() {
    const { userName, isGuest } = this.getActiveUserContext();
    const defaultMemory = isGuest
      ? "The current user is a Guest exploring Globally Known. Address them warmly as 'Guest' or 'friend' (e.g., 'Hello Guest!'). Never call them Adrian or assume any personal name unless they introduce themselves."
      : `User's name is ${userName}. Focus on natural spoken English intuition, real-world fluency, and modern conversational phrasing.`;

    const defaultGreetingExample = isGuest
      ? "Hey Guest! Good to see you. How's everything going today? What's on your mind?"
      : `Hey ${userName}! Good to see you. How's everything going today? What's on your mind?`;

    const saved = localStorage.getItem("sol_training_profile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        let userMemory = parsed.userMemory !== undefined ? parsed.userMemory : defaultMemory;
        // If memory still holds the old hardcoded Adrian for a guest or different user, adjust dynamically
        if (isGuest && userMemory.includes("Adrian")) {
          userMemory = defaultMemory;
        } else if (!isGuest && userMemory.includes("User's name is Adrian") && userName !== "Adrian") {
          userMemory = defaultMemory;
        }

        let examples = Array.isArray(parsed.examples) ? parsed.examples : [];
        if (examples.length === 0) {
          examples = [
            {
              id: "ex_1",
              userPrompt: "hi sol",
              idealResponse: defaultGreetingExample
            },
            {
              id: "ex_2",
              userPrompt: "how are you?",
              idealResponse: "I'm doing really well, thanks for asking! Feeling sharp and ready for whatever you want to chat about. How's your day treating you?"
            }
          ];
        }

        return {
          tone: parsed.tone || "natural",
          customDirectives: parsed.customDirectives !== undefined ? parsed.customDirectives : "Speak with natural, vibrant human energy. Be quick-witted, warm, perceptive, and spontaneous. Never sound like an automated corporate tutor or scripted chatbot.",
          userMemory: userMemory,
          examples: examples
        };
      } catch (e) {}
    }
    return {
      tone: "natural",
      customDirectives: "Speak with natural, vibrant human energy. Be quick-witted, warm, perceptive, and spontaneous. Never sound like an automated corporate tutor or scripted chatbot.",
      userMemory: defaultMemory,
      examples: [
        {
          id: "ex_1",
          userPrompt: "hi sol",
          idealResponse: defaultGreetingExample
        },
        {
          id: "ex_2",
          userPrompt: "how are you?",
          idealResponse: "I'm doing really well, thanks for asking! Feeling sharp and ready for whatever you want to chat about. How's your day treating you?"
        }
      ]
    };
  }

  saveTrainingProfile(profile) {
    localStorage.setItem("sol_training_profile", JSON.stringify(profile));
  }

  addTrainingExample(userPrompt, idealResponse) {
    const profile = this.getTrainingProfile();
    const cleanPrompt = (userPrompt || "").trim();
    const cleanResp = (idealResponse || "").trim();
    if (!cleanPrompt || !cleanResp) return null;

    const existingIndex = profile.examples.findIndex(ex => ex.userPrompt.toLowerCase().trim() === cleanPrompt.toLowerCase());
    const newExample = {
      id: existingIndex !== -1 ? profile.examples[existingIndex].id : "ex_" + Date.now(),
      userPrompt: cleanPrompt,
      idealResponse: cleanResp,
      updatedAt: new Date().toISOString()
    };

    if (existingIndex !== -1) {
      profile.examples[existingIndex] = newExample;
    } else {
      profile.examples.unshift(newExample);
    }

    this.saveTrainingProfile(profile);
    return newExample;
  }

  deleteTrainingExample(exampleId) {
    const profile = this.getTrainingProfile();
    profile.examples = profile.examples.filter(ex => ex.id !== exampleId);
    this.saveTrainingProfile(profile);
  }

  buildTrainedSystemInstruction(baseInstruction) {
    const profile = this.getTrainingProfile();
    let promptParts = [baseInstruction || "You are Sol, an advanced AI companion powered by Google Gemini on Globally Known."];

    const toneMap = {
      natural: "Tone Directive: Authentic, warm, relaxed, human-like, and conversational.",
      witty: "Tone Directive: High-energy, quick-witted, charismatic, playful, and sharp.",
      deep: "Tone Directive: Thoughtful, perceptive, philosophical, and intellectually curious.",
      mentor: "Tone Directive: Inspiring, encouraging, insightful, and patient."
    };
    if (profile.tone && toneMap[profile.tone]) {
      promptParts.push(toneMap[profile.tone]);
    }

    if (profile.customDirectives && profile.customDirectives.trim()) {
      promptParts.push(`### Custom Behavioral Directives (Trained by User):\n${profile.customDirectives.trim()}`);
    }

    if (profile.userMemory && profile.userMemory.trim()) {
      promptParts.push(`### Long-Term Memory & User Context:\n${profile.userMemory.trim()}`);
    }

    if (Array.isArray(profile.examples) && profile.examples.length > 0) {
      promptParts.push("### User-Trained Few-Shot Examples (Emulate this exact style, energy, and phrasing):\n" + 
        profile.examples.slice(0, 10).map(ex => `User: "${ex.userPrompt}"\nSol: "${ex.idealResponse}"`).join("\n\n")
      );
    }

    promptParts.push(`### STRICT DIRECT OUTPUT DIRECTIVES:
- You must output ONLY your final, direct response to the user.
- NEVER output internal thoughts, outlines, drafts ("Draft 1", "Draft 2"), notes, or meta-commentary.
- NEVER output breakdown bullet points (e.g. "*Greeting:*", "*Warmth:*", "*Draft:*").
- Begin speaking directly to the user immediately from your very first character.`);

    return promptParts.join("\n\n");
  }

  async generateResponseStream(messages, systemInstruction, modelName, onChunk, onError, onComplete) {
    const trainedInstruction = this.buildTrainedSystemInstruction(systemInstruction);

    // 1. Direct client-side call if user configured personal developer key
    if (this.apiKey) {
      try {
        const directSuccess = await this.fetchGeminiDirect(modelName, messages, trainedInstruction, onChunk, onComplete);
        if (directSuccess) return;
      } catch (err) {
        console.warn("Direct Gemini API call failed, attempting platform proxy fallback:", err);
      }
    }

    // 2. Centralized Turnkey Platform AI Proxy (Zero client API key needed!)
    if (this.hasPlatformKey) {
      try {
        const proxySuccess = await this.fetchGeminiPlatformProxy(modelName, messages, trainedInstruction, onChunk, onComplete);
        if (proxySuccess) return;
      } catch (err) {
        console.warn("Platform Gemini proxy failed:", err);
        const errMsg = err ? (err.message || String(err)) : "Platform AI connection error.";
        if (onError) onError(errMsg);
        this.simulateStreamingResponse(messages, trainedInstruction, onChunk, onComplete, true, errMsg);
        return;
      }
    }

    // 3. Fallback to offline simulation if no keys configured
    this.simulateStreamingResponse(messages, trainedInstruction, onChunk, onComplete);
  }

  simulateStreamingResponse(messages, systemInstruction, onChunk, onComplete, isApiKeyError = false, errorMsg = "") {
    const latestMessage = messages && messages.length > 0 ? messages[messages.length - 1] : null;
    const latestText = latestMessage ? (latestMessage.content || (latestMessage.parts && latestMessage.parts[0] ? latestMessage.parts[0].text : "")) : "";
    const prompt = (latestText || "").toLowerCase().trim();
    const cleanPrompt = prompt.replace(/[.,/#!$%^&*;:{}=-_~()?]/g, "").replace(/\s+/g, " ").trim();

    const { userName, isGuest } = this.getActiveUserContext();

    // Identify agent from systemInstruction
    let agentName = "General";
    if (systemInstruction.includes("Grammar") || systemInstruction.includes("grammar")) {
      agentName = "Grammar";
    } else if (systemInstruction.includes("Translator") || systemInstruction.includes("translator")) {
      agentName = "Translator";
    } else if (systemInstruction.includes("Vocabulary") || systemInstruction.includes("vocabulary")) {
      agentName = "Vocab";
    }

    let content = "";

    // 0. USER-TRAINED EXAMPLES FIRST (Interactive Few-Shot Learning Dataset)
    const userTraining = this.getTrainingProfile();
    if (userTraining && Array.isArray(userTraining.examples) && userTraining.examples.length > 0) {
      const matched = userTraining.examples.find(ex => {
        const exPrompt = (ex.userPrompt || "").toLowerCase().trim();
        const cleanExPrompt = exPrompt.replace(/[.,/#!$%^&*;:{}=-_~()?]/g, "").replace(/\s+/g, " ").trim();
        return cleanExPrompt === cleanPrompt || exPrompt === prompt || (cleanExPrompt.length > 3 && cleanPrompt.includes(cleanExPrompt));
      });
      if (matched && matched.idealResponse) {
        let resp = matched.idealResponse;
        if (isGuest && resp.includes("Adrian")) {
          resp = resp.replace(/\bAdrian\b/g, "Guest");
        } else if (!isGuest && resp.includes("Adrian") && userName !== "Adrian") {
          resp = resp.replace(/\bAdrian\b/g, userName);
        }
        content = resp;
      }
    }

    if (content) {
      // User trained this response specifically!
    }
    // 1. Natural Casual Greetings (Exact Gemini conversational energy)
    else if (/^(hi|hello|hey|hiya|howdy|yo|good\s+(morning|afternoon|evening|day))(\s+sol|\s+there|\s+gemini)?$/i.test(cleanPrompt) || 
        cleanPrompt === "hi" || cleanPrompt === "hello" || cleanPrompt === "hey" || cleanPrompt === "hi sol" || cleanPrompt === "hey sol") {
      const greetings = isGuest ? [
        `Hey Guest! Good to see you. How's everything going today? What's on your mind?`,
        `Hello Guest! Welcome to Globally Known. What would you like to chat about today?`,
        `Hey there! Great to see you. How's your day going so far?`,
        `Hi Guest! Great to hear from you. What's on your mind today?`,
        `Hello Guest! How can I help you practice or explore today?`
      ] : [
        `Hey ${userName}! Good to see you. How's everything going today? What's on your mind?`,
        `Hey there, ${userName}! How are things with you today? Up to anything interesting?`,
        `Hey ${userName}! How's your day treating you so far? What are you thinking about?`,
        `Hi ${userName}! Great to hear from you. What's going on today?`,
        `Hey ${userName}! Always great catching up with you. How's the day unfolding?`
      ];
      content = greetings[Math.floor(Math.random() * greetings.length)];
    }

    // 2. Status Check-in: "How are you?"
    else if (/how('s|\s+is)\s+(it\s+going|everything|your\s+day|life|things)|how\s+are\s+you|you\s+good|what('s|\s+is)\s+up|sup/i.test(prompt)) {
      const namePart = isGuest ? "" : `, ${userName}`;
      const responses = [
        `I'm doing really well, thanks for asking${namePart}! Feeling sharp and ready for whatever you want to chat about. How about yourself? How has your day been going?`,
        `Doing great! Always enjoy our conversations. How are things on your end today? Anything exciting happening?`,
        `I'm in great spirits! How has your day been treating you so far? Keeping busy, or having a relaxed one?`
      ];
      content = responses[Math.floor(Math.random() * responses.length)];
    }

    // 3. Positive User Status ("good", "doing well", "pretty good", "great")
    else if (/^(i('m|\s+am)\s+)?(doing\s+)?(good|great|fine|well|pretty\s+good|awesome|not\s+bad|ok|okay|chilling|relaxed)$/i.test(cleanPrompt) || cleanPrompt.includes("doing great") || cleanPrompt.includes("doing good") || cleanPrompt.includes("doing well")) {
      const positiveReplies = [
        `Love to hear that! Good momentum makes such a big difference. What have you been getting up to today?`,
        `Awesome! Glad things are feeling good on your end. What's been keeping you occupied today?`,
        `That's the spirit! Always great to catch you when the energy is up. What's on your radar for the rest of the day?`
      ];
      content = positiveReplies[Math.floor(Math.random() * positiveReplies.length)];
    }

    // 4. Exhausted / Down / Busy Status
    else if (/^(i('m|\s+am)\s+)?(tired|exhausted|busy|stressed|sleepy|bored|sad|overworked|not\s+great)$/i.test(cleanPrompt) || prompt.includes("tired") || prompt.includes("long day") || prompt.includes("stress")) {
      const namePart = isGuest ? "" : `, ${userName}`;
      content = `Man, I feel you${namePart}. Some days just drain the battery completely. Make sure you take some time to kick back, relax, and unplug tonight. What made today such a grind?`;
    }

    // 5. Identity & About Sol
    else if (/who\s+are\s+you|what\s+(are\s+you|is\s+sol|can\s+you\s+do)|tell\s+me\s+about\s+yourself/i.test(prompt)) {
      content = `I'm **Sol**, your AI companion powered by Google Gemini here on Globally Known! ⚡\n\nThink of me as a curious, sharp conversation partner you can bounce anything off of—whether you want to dive into deep ideas, break down complex concepts, explore language nuances, or just have a genuine, fun conversation about everyday life.\n\nWhat's something you've been thinking about or curious about lately?`;
    }

    // 6. Natural Language & Fluency Discussion
    else if (/practice|conversation|let('s|\s+us)\s+talk|roleplay|chat\s+with\s+me|speak\s+english/i.test(prompt)) {
      content = `I'm always down to chat! The best part about natural conversation is that you don't need a rigid plan—we can talk about music, movies, tech, travel, crazy ideas, or what you did today. Where would you like to start?`;
    }

    // 7. Everyday Topics: Food, Coffee, Weekend, Hobbies
    else if (prompt.includes("coffee") || prompt.includes("cafe")) {
      content = `Now you're speaking my language! Are you an espresso purist, a pour-over fanatic, or do you lean more towards a cozy cappuccino or iced cold brew? What's your go-to morning brew?`;
    }

    else if (prompt.includes("weekend") || prompt.includes("plans")) {
      content = `Weekends always have their own personality! Did you get up to anything memorable, or was it more of a peaceful, recharge-the-batteries kind of vibe?`;
    }

    else if (prompt.includes("hobby") || prompt.includes("hobbies") || prompt.includes("free time")) {
      content = `I love hearing about what people get lost in when they have time to themselves. What's that one thing you can spend hours doing without noticing the clock? Music, gaming, building stuff, reading, or something else entirely?`;
    }

    // 8. Jokes & Humor
    else if (prompt.includes("joke") || prompt.includes("funny")) {
      const jokes = [
        `Why do programmers prefer dark mode?\n\n*Because light attracts bugs!* 🐛💻\n\n(Corny, but accurate!)`,
        `Why don't scientists trust atoms?\n\n*Because they make up everything!* ⚛️😄`,
        `Parallel lines have so much in common...\n\n*It's a shame they'll never meet.* 📐😉`
      ];
      content = jokes[Math.floor(Math.random() * jokes.length)];
    }

    // 9. Idioms & Linguistic Nuance
    else if (prompt.includes("idiom") || prompt.includes("expression") || prompt.includes("slang")) {
      content = `Here's a great one that native speakers use all the time:\n\n### 💡 **"Cut to the chase"**\n* **What it means:** Skip the small talk and background details, and get straight to the essential point.\n* **How to use it naturally:** *"Look, we don't have all afternoon, let's just **cut to the chase**—what's the bottom line?"*\n* **Where it comes from:** Early silent films! Romance and comedy scenes were fine, but the audience really wanted the thrilling chase scene at the end, so directors were told to literally *"cut to the chase."*\n\nDo you have a favorite English idiom, or one that ever puzzled you?`;
    }

    // 10. Grammar Breakdown (Clear, intuitive, zero dry textbook lecture)
    else if (agentName === "Grammar" || prompt.includes("grammar") || prompt.includes("correct this") || prompt.includes("check my sentence")) {
      if (prompt.includes("who") && prompt.includes("whom")) {
        content = `Here's the cleanest mental trick for **"who"** vs. **"whom"**:\n\n* Ask yourself: would you replace it with **"he/she"** or **"him/her"**?\n  * If **he/she** fits ➔ use **who** (*"**Who** called?"* ➔ *"**He** called."*)\n  * If **him/her** fits ➔ use **whom** (*"To **whom** did you give it?"* ➔ *"To **him**."*)\n\n(Notice both *hi**m*** and *who**m*** end in **M**—that's the mnemonic!)`;
      } else {
        content = `Drop the sentence right here! I'll look it over and give you a clear, natural breakdown—not just what's technically correct, but how a native speaker would actually phrase it in real conversation.`;
      }
    }

    // 11. Translation / Cultural Nuance
    else if (agentName === "Translator" || prompt.includes("translate") || prompt.includes("how do you say")) {
      content = `Send the phrase my way, along with where you're planning to use it (casual chat, business email, or slang), and I'll give you both the literal and the natural idiomatic phrasing!`;
    }

    // 12. Dynamic Contextual Reflection (Genuinely intelligent conversational flow)
    else {
      const naturalReflections = [
        `That's really interesting, ${userName}. What led you to that, or what got you thinking about it?`,
        `I hear you! That makes a lot of sense. How do you usually look at something like that?`,
        `That's a fascinating angle, ${userName}. Tell me a bit more about that—what's your take on it?`,
        `I completely get where you're coming from. What happened next, or how are you feeling about it now?`
      ];
      content = naturalReflections[Math.floor(Math.random() * naturalReflections.length)];
    }

    // Stream the response back smoothly
    const combinedContent = content;
    const words = combinedContent.split(" ");
    let currentIndex = 0;
    let accumulatedText = "";

    const timer = setInterval(() => {
      if (currentIndex >= words.length) {
        clearInterval(timer);
        if (onComplete) {
          onComplete(combinedContent);
        }
        return;
      }

      const chunkCount = Math.min(3, words.length - currentIndex);
      const nextWords = words.slice(currentIndex, currentIndex + chunkCount).join(" ") + " ";
      accumulatedText += nextWords;
      onChunk(nextWords);
      currentIndex += chunkCount;
    }, 20);
  }

}
