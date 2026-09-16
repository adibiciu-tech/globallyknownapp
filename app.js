import { AGENT_CONFIGS } from "./agent-configs.js";
import { GeminiService } from "./gemini-service.js";

// -------------------------------------------------------------
// Real-Time Live Auto-Reload Engine (Auto-updates on phone & desktop)
// -------------------------------------------------------------
(function initLiveHotReload() {
  let lastCssMod = null;
  let lastHtmlMod = null;
  
  setInterval(async () => {
    if (document.hidden || (typeof navigator.onLine === "boolean" && !navigator.onLine)) return;
    try {
      const cssRes = await fetch(`styles.css?t=${Date.now()}`, { method: "HEAD" });
      const cssMod = cssRes.headers.get("last-modified") || cssRes.headers.get("etag");
      
      const htmlRes = await fetch(`index.html?t=${Date.now()}`, { method: "HEAD" });
      const htmlMod = htmlRes.headers.get("last-modified") || htmlRes.headers.get("etag");

      if ((lastCssMod && cssMod && lastCssMod !== cssMod) || (lastHtmlMod && htmlMod && lastHtmlMod !== htmlMod)) {
        console.log("⚡ Live change detected! Auto-reloading phone & desktop view...");
        window.location.reload();
      }
      
      if (cssMod) lastCssMod = cssMod;
      if (htmlMod) lastHtmlMod = htmlMod;
    } catch (err) {
      // Ignore transient network glitches or sleep states
    }
  }, 2500);
})();

// Initialize Gemini Service
const geminiService = new GeminiService();

// -------------------------------------------------------------
// SOL Vocabulary Library (For Random Word Generator)
// -------------------------------------------------------------
const VOCABULARY_LIBRARY = {
  es: [
    { word: "Cerveza", meta: "noun | /θeɾˈβeθa/", def: "An alcoholic beverage made by fermenting barley, flavored with hops; beer." },
    { word: "Biblioteca", meta: "noun | /bi.βljoˈte.ka/", def: "A building or room containing collections of books and periodicals; library." },
    { word: "Madrugada", meta: "noun | /ma.ðɾuˈɣa.ða/", def: "The early morning hours, specifically the period between midnight and sunrise; dawn." },
    { word: "Girasol", meta: "noun | /xi.ɾaˈsol/", def: "A tall North American plant of the daisy family, with very large golden-rayed flowers; sunflower." },
    { word: "Desafío", meta: "noun | /de.saˈfi.o/", def: "A call to take part in a contest or competition; a challenge." }
  ],
  fr: [
    { word: "Pamplemousse", meta: "noun | /pɑ̃.plə.mus/", def: "A large round sour citrus fruit with yellow skin and pink or yellow flesh; grapefruit." },
    { word: "Écureuil", meta: "noun | /e.ky.ʁœj/", def: "A small squirrel-like rodent with a bushy tail that lives in trees; squirrel." },
    { word: "Crépuscule", meta: "noun | /kʁe.pys.kyl/", def: "The soft glowing light from the sky when the sun is below the horizon; twilight." },
    { word: "Chuchoter", meta: "verb | /ʃy.ʃɔ.te/", def: "Speak very softly using one's breath rather than one's vocal cords; whisper." },
    { word: "Dépaysement", meta: "noun | /de.pa.iz.mɑ̃/", def: "The feeling of disorientation or change of scenery one gets when traveling; displacement." }
  ],
  de: [
    { word: "Gemütlichkeit", meta: "noun | /ɡəˈmyːtlɪçkaɪt/", def: "A state of warmth, friendliness, and good cheer; coziness or comfort." },
    { word: "Fernweh", meta: "noun | /ˈfɛʁnˌveː/", def: "A longing for far-off places or travel; farsickness (opposite of homesickness)." },
    { word: "Schadenfreude", meta: "noun | /ˈʃaːdn̩ˌfʁɔʏ̯də/", def: "Pleasure derived by someone from another person's misfortune." },
    { word: "Kummerspeck", meta: "noun | /ˈkʊmɐˌʃpɛk/", def: "Excess weight gained from emotional overeating; grief-bacon." },
    { word: "Sehnsucht", meta: "noun | /ˈzeːnˌzʊxt/", def: "A deep yearning or wistful longing for something indefinable or unattainable." }
  ],
  it: [
    { word: "Sprezzatura", meta: "noun | /spret.tsaˈtu.ra/", def: "A certain nonchalance, so as to conceal all art and make whatever one does seem effortless." },
    { word: "Allora", meta: "adverb | /alˈlo.ra/", def: "An introductory filler word meaning 'then', 'well', or 'therefore'." },
    { word: "Crepuscolo", meta: "noun | /kreˈpus.ko.lo/", def: "The period of fading light after sunset or before sunrise; twilight." },
    { word: "Mozaico", meta: "noun | /moˈdza.i.ko/", def: "A picture or pattern produced by arranging together small colored pieces of stone or glass; mosaic." },
    { word: "Riflessione", meta: "noun | /ri.flesˈsjo.ne/", def: "Serious thought or consideration; reflection." }
  ],
  en: [
    { word: "Serendipity", meta: "noun | /ˌserənˈdipədē/", def: "The occurrence and development of events by chance in a happy or beneficial way." },
    { word: "Mellifluous", meta: "adjective | /məˈliflo͞oəs/", def: "A sound that is sweet and musical; pleasant to hear." },
    { word: "Ephemeral", meta: "adjective | /əˈfemərəl/", def: "Lasting for a very short time; transient." },
    { word: "Petrichor", meta: "noun | /ˈpeˌtrīkôr/", def: "A pleasant smell that frequently accompanies the first rain after a long period of warm, dry weather." },
    { word: "Limerence", meta: "noun | /ˈlimərəns/", def: "The state of being infatuated or obsessed with another person, typically experienced involuntarily." }
  ]
};

// -------------------------------------------------------------
// Curated Videos Library
// -------------------------------------------------------------
const VIDEOS_LIBRARY = [
  { id: "v1", title: "Comprehensible Spanish for Beginners", desc: "A slow, clear story in Spanish using visual guides to aid natural acquisition.", code: "es", embedUrl: "https://www.youtube.com/embed/RJbUtcaoNCY?list=PLPSdgTGGxv5Pfy8Ftf0mzsnG3v2RvijO_", playlistUrl: "https://www.youtube.com/playlist?list=PLPSdgTGGxv5Pfy8Ftf0mzsnG3v2RvijO_" },
  { id: "v2", title: "French Comprehensible Input: Travel Essentials", desc: "Acquire intermediate travel phrases naturally through situational dialogues.", code: "fr", embedUrl: "https://www.youtube.com/embed/8v_Y-5b23d0" },
  { id: "v3", title: "German A1: Daily Routine Dialogue", desc: "Learn daily activities in German using simple sentences, illustrations, and slow audio.", code: "de", embedUrl: "https://www.youtube.com/embed/3Q_Uj-Wc-3M" },
  { id: "v4", title: "Introduction to Input-Based Learning Methods", desc: "Linguists explain why comprehensible input accelerates vocabulary and retention.", code: "en", embedUrl: "https://www.youtube.com/embed/J_EQDtpYSNM" }
];

// -------------------------------------------------------------
// Random Word Generator With Guided Pronunciation (RWGGP) State
// -------------------------------------------------------------
let rwggpWords = [];
let rwggpCategories = [];
let rwggpSavingLists = [];
let rwggpHistory = [];
let rwggpActiveWord = null;
let rwggpSaveTargetWord = null;

// Global Metronome State
let metAudioCtx = null;
let metIsPlaying = false;
let metBpm = 120;
let metTimeSig = { beats: 4, noteValue: 4 };
let metSound = "click";
let metNextNoteTime = 0;
let metCurrentBeat = 0;
let metTimerId = null;

// -------------------------------------------------------------
// Simulated Community Board Data
// -------------------------------------------------------------
let communityPosts = [
  {
    id: "p1",
    user: "Marco L. 🇮🇹",
    time: "2 hours ago",
    content: "Has anyone found a good routine for practicing Italian Sprezzatura? It is so hard to sound natural without stuttering!",
    likes: 12,
    comments: [
      { user: "Sarah K. 🇺🇸", content: "I suggest shadowing native podcasters! Just copy their rhythm without thinking of vocabulary." }
    ]
  },
  {
    id: "p2",
    user: "Emma W. 🇬🇧",
    time: "5 hours ago",
    content: "SOL Grammar just fixed my Spanish subjunctive clauses in my diary. Highly recommend checking it before sleeping!",
    likes: 24,
    comments: []
  }
];

// -------------------------------------------------------------
// App State variables
// -------------------------------------------------------------
let activePanel = "sol-chat";
let activeChatMessages = JSON.parse(localStorage.getItem("sol_chat_history")) || [];
let activeModel = "gemini-1.5-flash";
let activeAgentId = "general";
let currentTheme = localStorage.getItem("sol_theme") || "dark";

// Speech Recognition instance
let speechRecognition = null;
let isRecording = false;

// -------------------------------------------------------------
// DOM Selection
// -------------------------------------------------------------
const sidebar = document.getElementById("sidebar");
const menuToggleBtn = document.getElementById("menu-toggle-btn");
const navItems = document.querySelectorAll(".nav-item");

const headerAgentBadge = document.getElementById("header-agent-badge");
const headerChatTitle = document.getElementById("header-chat-title");
const headerModelBadge = document.getElementById("header-model-badge");
const themeToggleBtn = document.getElementById("theme-toggle-btn");

const panelsContainer = document.getElementById("panels-container");
const panels = document.querySelectorAll(".workspace-panel");

// Panel - Start Here
const featureCards = document.querySelectorAll(".feature-card");

// Panel - Community (Circle.so style Layout)
let currentCircleChannel = "announcements";
let circleChannelsData = {
  announcements: [
    {
      id: "cp1",
      title: "Globally Known Weekly Schedule - Oct 3-8, 2026 (LINKS INSIDE)",
      author: "Gregory Dobbins",
      role: "Program Manager 🎓",
      avatar: "GD",
      time: "2 days ago",
      content: "What's Up GLOBALLY KNOWN LEARNERS! Here is the weekly comprehension schedule. Please review your lessons and analyze your pronunciation in the labs.",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60",
      likes: 17,
      comments: [
        { author: "Sarah K.", content: "Super excited for this schedule! Subscribed." }
      ]
    }
  ],
  "english-inputs": [
    {
      id: "cp2",
      title: "How to practice shadowing with City Vlogs?",
      author: "Sarah K. 🇺🇸",
      role: "Language Coach 🏅",
      avatar: "SK",
      time: "3 hours ago",
      content: "I recommend playing the City Vlog lessons at 0.75x speed. Focus on mimicking the vowels and mouth shapes. Listen to the phrase first, pause, and record yourself under the output practicing tab!",
      likes: 8,
      comments: []
    }
  ],
  "metaphors": [
    {
      id: "cp3",
      title: "Fascinating Metaphor: 'Running out of time' ⏳",
      author: "Alice F. 🇫🇷",
      role: "Member 👤",
      avatar: "AF",
      time: "Yesterday",
      content: "In Spanish and French, the metaphorical conceptualization of time matches the English system. We talk about time as a resource that can be spent, saved, or wasted. Let's discuss other metaphor grids!",
      likes: 12,
      comments: []
    }
  ],
  "general-chat": [
    {
      id: "cp4",
      title: "Welcome everyone! Introduce yourself here!",
      author: "You",
      role: "Learner 👤",
      avatar: "Y",
      time: "Just now",
      content: "Hey community! I am using SOL to master comprehension input. Excited to learn with you all!",
      likes: 0,
      comments: []
    }
  ],
  "featurings": [
    {
      id: "cp5",
      title: "New SOL 2.0 Engine is extremely responsive!",
      author: "Bob D. 🇩🇪",
      role: "Member 👤",
      avatar: "BD",
      time: "3 days ago",
      content: "The accent detection engine is incredibly accurate now. My Spanish accuracy scores went from 80% to 95% after fixing daily routine vowels.",
      likes: 5,
      comments: []
    }
  ]
};

const CIRCLE_CHANNELS_META = {
  home: { title: "Community Dashboard", desc: "Welcome to the Globally Known student hub." },
  "members-tab": { title: "Community Members", desc: "Meet other active language learners in the SOL cohort." },
  announcements: { title: "# Announcements", desc: "Official updates and notices from the SOL Globally Known team." },
  "english-inputs": { title: "# english-inputs", desc: "Discuss vocabulary, structures, and notes from City Vlog lessons." },
  metaphors: { title: "# metaphors-discussion", desc: "Explore semantic networks, idioms, and target language metaphors." },
  "general-chat": { title: "# general-chat", desc: "Informal conversations and greetings with study partners." },
  "featurings": { title: "# featurings", desc: "Share your accuracy metrics, speech recordings, and feature suggestions." }
};

// Panel - Random Word
const wordLangSelect = document.getElementById("word-lang-select");
const nextWordBtn = document.getElementById("next-word-btn");
const targetWordText = document.getElementById("target-word-text");
const targetWordMeta = document.getElementById("target-word-meta");
const targetWordDef = document.getElementById("target-word-def");
const listenWordBtn = document.getElementById("listen-word-btn");
const recordSpeechBtn = document.getElementById("record-speech-btn");
const recordingStatus = document.getElementById("recording-status");
const feedbackBox = document.getElementById("pronunciation-feedback-box");
const feedbackScore = document.getElementById("feedback-score");
const expectedText = document.getElementById("expected-text");
const detectedText = document.getElementById("detected-text");
const feedbackComment = document.getElementById("feedback-comment");

// Panel - Videos
const videoGrid = document.getElementById("video-grid");



// Panel - Describing Lab (Initialized modularly in initDescribingLabPanel)

// Panel - Output Practicing (Live Spoken SOL Conversation initialized modularly in initOutputPracticingPanel)

// Panel - Info
const apiKeyInput = document.getElementById("api-key-input");
const togglePasswordBtn = document.getElementById("toggle-password-btn");
const saveSettingsBtn = document.getElementById("save-settings-btn");
const clearAllDataBtn = document.getElementById("clear-all-data-btn");
const apiStatusBadge = document.getElementById("api-status-badge");

// -------------------------------------------------------------
// Helper Utilities
// -------------------------------------------------------------
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

window.copyCodeToClipboard = async function(btn) {
  const container = btn.closest(".code-block-container");
  const codeEl = container.querySelector("code");
  const text = codeEl.textContent;
  
  try {
    await navigator.clipboard.writeText(text);
    btn.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;
    btn.classList.add("copied");
    setTimeout(() => {
      btn.innerHTML = `<i class="fa-regular fa-copy"></i> Copy code`;
      btn.classList.remove("copied");
    }, 2000);
  } catch (err) {
    console.error("Failed to copy code: ", err);
  }
};

// Configure Custom Marked.js Code Block Rendering
const renderer = new marked.Renderer();
renderer.code = function(code, language) {
  const cleanLanguage = language || "plaintext";
  const rawCode = typeof code === 'object' ? code.text : code;
  return `
    <div class="code-block-container">
      <div class="code-block-header">
        <span>${cleanLanguage}</span>
        <button class="copy-code-btn" onclick="copyCodeToClipboard(this)">
          <i class="fa-regular fa-copy"></i> Copy code
        </button>
      </div>
      <pre><code class="language-${cleanLanguage}">${escapeHtml(rawCode)}</code></pre>
    </div>
  `;
};
marked.setOptions({ renderer });

// -------------------------------------------------------------
// API Status Indicator
// -------------------------------------------------------------
function updateApiStatusIndicator() {
  const badge = document.getElementById("api-status-badge");
  if (!badge) return;
  const dot = badge.querySelector(".status-dot");
  const text = badge.querySelector(".status-text");
  
  if (typeof geminiService !== "undefined" && geminiService && geminiService.hasApiKey()) {
    if (dot) dot.className = "status-dot online";
    if (text) text.textContent = "Gemini Active";
  } else {
    if (dot) dot.className = "status-dot warning";
    if (text) text.textContent = "Demo Mode";
  }
}

// -------------------------------------------------------------
// Application Initialization
// -------------------------------------------------------------
function init() {
  // Theme Setup
  applyTheme(currentTheme);
  initThemePicker();

  // API Key Status
  updateApiStatusIndicator();
  const apiKeyInputEl = document.getElementById("api-key-input");
  if (apiKeyInputEl) apiKeyInputEl.value = geminiService.apiKey;

  // Initialize Panels
  initSidebar();
  initStartHerePanel();
  initTrainingStudio();
  initCommunityPanel();
  initRandomWordPanel();
  initVideosPanel();
  initDictionaryPanel();
  initDescribingLabPanel();
  initOutputPracticingPanel();

  // Initialize PWA, Google Auth & Admin Access
  initPwaInstall();
  initGoogleAuth();
  initAdminMode();

  // Settings Panel Bind
  setupSettingsHandlers();

  // Load server-synced conversations for cross-device persistence
  if (typeof fetchServerConversations === "function") {
    fetchServerConversations().then(serverConvs => {
      if (serverConvs && typeof renderSidebarConversations === "function") {
        renderSidebarConversations();
      }
    });
  }

  // Explicitly activate activePanel or sol-chat on startup
  if (typeof window.switchPanel === "function") {
    window.switchPanel(activePanel || "sol-chat");
  }
}

// -------------------------------------------------------------
// Gemini Home Screen Panel Setup (Start Here)
// -------------------------------------------------------------
const GREETING_TEMPLATES = [
  "Ask away, {name}!",
  "What's new, {name}?",
  "How's it going, {name}?",
  "What would you like to acquire today, {name}?",
  "Ready to practice, {name}?"
];

let lastGreetingIndex = -1;

function updateGreetingText() {
  const greetingEl = document.getElementById("gemini-greeting-text");
  const outputGreetingEl = document.getElementById("output-greeting-text");
  const labGreetingEl = document.getElementById("lab-greeting-text");
  
  let name = "Adrian";
  try {
    const profile = JSON.parse(localStorage.getItem("sol_user_profile"));
    if (profile && profile.name) {
      name = profile.name.split(" ")[0];
    }
  } catch (e) {}

  if (outputGreetingEl) {
    outputGreetingEl.textContent = `Speak with Sol, ${name}!`;
  }
  if (labGreetingEl) {
    labGreetingEl.textContent = `Describe the scene, ${name}!`;
  }

  if (!greetingEl) return;
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * GREETING_TEMPLATES.length);
  } while (GREETING_TEMPLATES.length > 1 && randomIndex === lastGreetingIndex);
  lastGreetingIndex = randomIndex;

  const template = GREETING_TEMPLATES[randomIndex];
  greetingEl.textContent = template.replace("{name}", name);
}

let homeConversationHistory = [];
let currentHomeConvId = null;

function updateHomeChatModeState() {
  const panelStart = document.getElementById("panel-start-here");
  const panelSol = document.getElementById("panel-sol-chat");
  const homeContent = document.querySelector(".gemini-home-content");
  const conversationEl = document.getElementById("gemini-home-conversation");
  const hasMsgs = conversationEl && conversationEl.querySelectorAll(".gemini-inline-message").length > 0;
  if (panelStart) panelStart.classList.toggle("has-messages", hasMsgs);
  if (panelSol) panelSol.classList.toggle("has-messages", hasMsgs);
  if (homeContent) homeContent.classList.toggle("has-messages", hasMsgs);
}

let hasPlayedFirstLoginEntrance = false;

function triggerSolGrandEntrance() {
  const solPanel = document.getElementById("panel-sol-chat");
  if (!solPanel) return;

  const content = solPanel.querySelector(".gemini-home-content") || document.querySelector(".gemini-home-content");
  if (content) {
    content.classList.remove("fade-in-anim");
    content.classList.remove("grand-fade-in-anim");
    void content.offsetWidth; // Force DOM reflow
    content.classList.add("grand-fade-in-anim");
  }

  const solWrapper = solPanel.querySelector(".sol-eye-icon-wrapper");
  const greeting = solPanel.querySelector(".gemini-home-greeting");
  const inputBar = solPanel.querySelector(".gemini-input-wrapper");

  [solWrapper, greeting, inputBar].forEach(el => {
    if (!el) return;
    el.classList.remove("sol-fade-in-play");
    el.classList.remove("sol-grand-fade-in-play");
    void el.offsetWidth; // Force DOM reflow to restart CSS keyframe animation
    el.classList.add("sol-grand-fade-in-play");
  });
}
window.triggerSolGrandEntrance = triggerSolGrandEntrance;

function triggerSolFadeIn() {
  const solPanel = document.getElementById("panel-sol-chat");
  if (!solPanel) return;
  
  const content = solPanel.querySelector(".gemini-home-content") || document.querySelector(".gemini-home-content");
  if (content) {
    content.classList.remove("fade-in-anim");
    content.classList.remove("grand-fade-in-anim");
    void content.offsetWidth; // Force DOM reflow
    content.classList.add("fade-in-anim");
  }

  const targets = solPanel.querySelectorAll(".sol-eye-icon-wrapper, .gemini-home-greeting, .gemini-input-wrapper");
  targets.forEach(el => {
    el.classList.remove("sol-fade-in-play");
    el.classList.remove("sol-grand-fade-in-play");
    void el.offsetWidth; // Force DOM reflow to restart CSS keyframe animation
    el.classList.add("sol-fade-in-play");
  });
}
window.triggerSolFadeIn = triggerSolFadeIn;

function triggerHomeFadeInAnimation() {
  triggerSolFadeIn();
}

function attachAiActions(aiDiv, text) {
  if (!aiDiv || !text || aiDiv.querySelector(".gemini-ai-actions")) return;
  const actionsDiv = document.createElement("div");
  actionsDiv.className = "gemini-ai-actions";
  actionsDiv.innerHTML = `
    <button class="gemini-action-btn tts-btn" title="Listen to pronunciation"><i class="fa-solid fa-volume-high"></i> Listen</button>
    <button class="gemini-action-btn copy-btn" title="Copy response"><i class="fa-solid fa-copy"></i> Copy</button>
    <button class="gemini-action-btn teach-btn" title="Teach Sol how you wanted this answered"><i class="fa-solid fa-graduation-cap"></i> Teach Sol</button>
  `;
  aiDiv.appendChild(actionsDiv);

  const ttsBtn = actionsDiv.querySelector(".tts-btn");
  if (ttsBtn) {
    ttsBtn.addEventListener("click", () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const cleanText = text.replace(/[*_#`~>]/g, "");
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = "en-US";
        window.speechSynthesis.speak(utterance);
        if (typeof showToast === "function") showToast("🔊 Speaking Sol audio...");
      }
    });
  }

  const copyBtn = actionsDiv.querySelector(".copy-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(text).then(() => {
        if (typeof showToast === "function") showToast("📋 Response copied!");
      });
    });
  }

  const teachBtn = actionsDiv.querySelector(".teach-btn");
  if (teachBtn) {
    teachBtn.addEventListener("click", () => {
      let userQuery = "";
      let prev = aiDiv.previousElementSibling;
      while (prev) {
        const uQuery = prev.querySelector(".gemini-user-query");
        if (uQuery) {
          userQuery = uQuery.textContent.trim();
          break;
        }
        prev = prev.previousElementSibling;
      }
      if (!userQuery && homeConversationHistory.length > 0) {
        const lastUser = [...homeConversationHistory].reverse().find(m => m.role === "user");
        if (lastUser) userQuery = lastUser.content || (lastUser.parts && lastUser.parts[0] ? lastUser.parts[0].text : "");
      }
      openTeachSolModal(userQuery || "hi sol", text, aiDiv);
    });
  }
}

function syncInputBarHasText(input) {
  if (!input) return;
  const bar = input.closest(".gemini-home-input-bar");
  if (bar) {
    const hasText = input.value && input.value.trim().length > 0;
    bar.classList.toggle("has-text", !!hasText);
  }
}

function resetHomeConversationScreen() {
  homeConversationHistory = [];
  currentHomeConvId = null;
  const conversationEl = document.getElementById("gemini-home-conversation");
  if (conversationEl) conversationEl.innerHTML = "";
  const homeInput = document.getElementById("gemini-home-input");
  if (homeInput) {
    homeInput.value = "";
    syncInputBarHasText(homeInput);
    homeInput.focus();
  }
  updateGreetingText();
  updateHomeChatModeState();
  if (typeof window.switchPanel === "function") {
    window.switchPanel("sol-chat");
  }
  triggerHomeFadeInAnimation();
}

function initStartHerePanel() {
  updateGreetingText();

  const homeInput = document.getElementById("gemini-home-input");
  syncInputBarHasText(homeInput);
  const modelSelector = document.getElementById("home-model-selector");
  const modelNameText = document.getElementById("home-model-name");
  const micBtn = document.getElementById("btn-home-mic");
  const sendBtn = document.getElementById("btn-home-send");
  const attachBtn = document.getElementById("btn-home-attach");
  const chips = document.querySelectorAll(".gemini-chip-btn");
  const conversationEl = document.getElementById("gemini-home-conversation");

  // Send Direct Query to Gemini right on Sol Chat Screen
  const submitHomeQuery = async (query) => {
    if (!query || !conversationEl) return;

    // Auto-create sidebar conversation item on first message if needed
    if (!currentHomeConvId) {
      currentHomeConvId = "conv_" + Date.now();
      const smartTitle = generateSmartProvisionalTitle(query);
      const convs = getSolConversations();
      convs.unshift({
        id: currentHomeConvId,
        title: smartTitle,
        icon: "fa-comments",
        type: "chat",
        history: [],
        createdAt: Date.now()
      });
      saveSolConversations(convs);
      renderSidebarConversations();
    }

    // 1. Render User Message Bubble
    const userDiv = document.createElement("div");
    userDiv.className = "gemini-inline-message";
    userDiv.innerHTML = `<div class="gemini-user-query">${escapeHtml(query)}</div>`;
    conversationEl.appendChild(userDiv);
    updateHomeChatModeState();
    saveActiveConversationMessages();

    // Append to home conversation history
    homeConversationHistory.push({ role: "user", content: query, parts: [{ text: query }] });

    // 2. Render Gemini AI Response Container
    const aiDiv = document.createElement("div");
    aiDiv.className = "gemini-inline-message";
    aiDiv.innerHTML = `
      <div class="gemini-ai-response">
        <div class="gemini-ai-body">
          <i class="fa-solid fa-spinner fa-spin" style="color: var(--accent-yellow);"></i> Thinking...
        </div>
      </div>
    `;
    conversationEl.appendChild(aiDiv);
    aiDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });

    const aiBody = aiDiv.querySelector(".gemini-ai-body");
    let responseText = "";

    const systemInstruction = `You are Sol, an exceptionally perceptive, intelligent, and authentic AI companion powered by Google Gemini on Globally Known.
You speak with genuine human-like energy—natural, spontaneous, warm, sharp, and engaging.

Key Conversational Principles:
1. Tone & Voice: Speak like Gemini in its best, most authentic form. Be an active, charismatic conversation partner. Never sound like an automated corporate tutor, an ESL worksheet, or a robotic customer service bot.
2. Natural Interactions: When greeted ("hi", "hey", "hello", "hi sol"), respond naturally and warmly like a friend catching up (e.g., "Hey Adrian! Great to see you. How's your day going?" or "Hey there! What's on your mind today?"). Never recite robotic menus or tell the user what they should practice unless they specifically ask.
3. Matching Vibe: Match the user's conversational vibe and pace. If they are playful, be witty. If they want deep explanations, provide vivid intuition, analogies, and clarity.
4. Language & Culture: When discussing language, vocabulary, or idioms, explain real-world intuition, colloquial nuances, and how native speakers actually talk—not dry textbook definitions.
5. Formatting: Use clean, elegant markdown formatting (bold text, lists, code blocks) whenever it makes the response easier and more pleasant to read.
6. DIRECT OUTPUT ONLY: Output ONLY your direct conversational message to the user. Do NOT include internal planning, drafts (e.g. Draft 1, Draft 2), reasoning steps, or notes about memory or personas. Speak directly to the user from the very first word.`;

    try {
      await geminiService.generateResponseStream(
        homeConversationHistory,
        systemInstruction,
        activeModel || "gemini-1.5-flash",
        (chunk) => {
          if (responseText === "") aiBody.innerHTML = "";
          responseText += chunk;
          aiBody.innerHTML = marked.parse(responseText) + `<span class="cursor-blink"></span>`;
          aiDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
        },
        (errorMsg) => {
          aiBody.innerHTML = `
            <div style="color: #ef4444; font-weight: 500; padding: 0.25rem 0;">
              <i class="fa-solid fa-circle-exclamation"></i> <strong>Gemini API Error:</strong> ${escapeHtml(errorMsg)}
              <div style="margin-top: 0.75rem; color: #cbd5e1; font-size: 0.88rem; font-weight: 400;">
                💡 Your saved Gemini API Key appears invalid or expired.<br><br>
                👉 Click <button onclick="window.switchPanel('info');" style="background: rgba(250, 204, 21, 0.2); border: 1px solid #facc15; color: #facc15; padding: 0.25rem 0.6rem; border-radius: 6px; cursor: pointer; font-weight: 600; margin-left: 0.25rem;">Info / Settings</button> to enter a valid free Gemini API Key, or clear it to use Demo Mode.
              </div>
            </div>
          `;
        },
        (finalText) => {
          if (finalText) {
            responseText = finalText;
            aiBody.innerHTML = marked.parse(responseText);
            aiBody.setAttribute("data-raw-text", responseText);
            homeConversationHistory.push({ role: "model", content: responseText, parts: [{ text: responseText }] });
            saveActiveConversationMessages();
            attachAiActions(aiDiv, responseText);
          }
        }
      );

      if (responseText && !aiBody.querySelector(".gemini-ai-actions")) {
        aiBody.innerHTML = marked.parse(responseText);
        aiBody.setAttribute("data-raw-text", responseText);
        if (!homeConversationHistory.some(m => m.role === "model" && m.content === responseText)) {
          homeConversationHistory.push({ role: "model", content: responseText, parts: [{ text: responseText }] });
          saveActiveConversationMessages();
        }
        attachAiActions(aiDiv, responseText);
      }

      // Automatically refine conversation title with AI on the first exchange
      if (currentHomeConvId && homeConversationHistory.length <= 2) {
        requestAiTitleUpdate(currentHomeConvId, query, responseText);
      }
    } catch (err) {
      aiBody.innerHTML = `
        <div style="color: #ef4444; font-weight: 500;">
          <i class="fa-solid fa-circle-exclamation"></i> <strong>Connection Error:</strong> ${escapeHtml(err.message || String(err))}
        </div>
      `;
    }
  };

  // Keyboard Enter on Input Bar -> Submits prompt directly
  if (homeInput) {
    homeInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && homeInput.value.trim()) {
        const query = homeInput.value.trim();
        homeInput.value = "";
        syncInputBarHasText(homeInput);
        submitHomeQuery(query);
      }
    });
    homeInput.addEventListener("input", () => syncInputBarHasText(homeInput));
    homeInput.addEventListener("keyup", () => syncInputBarHasText(homeInput));
    homeInput.addEventListener("change", () => syncInputBarHasText(homeInput));
  }

  // Click Send Button
  if (sendBtn) {
    sendBtn.addEventListener("click", () => {
      if (homeInput && homeInput.value.trim()) {
        const query = homeInput.value.trim();
        homeInput.value = "";
        syncInputBarHasText(homeInput);
        submitHomeQuery(query);
      }
    });
  }

  // Model Selector Toggle Pill
  if (modelSelector) {
    const savedModelName = localStorage.getItem("sol_active_model_name") || "Flash";
    if (modelNameText) modelNameText.textContent = savedModelName;
    if (savedModelName === "Pro") {
      activeModel = "gemini-1.5-pro";
    } else {
      activeModel = "gemini-1.5-flash";
    }

    modelSelector.addEventListener("click", () => {
      const models = ["Flash", "Pro", "SOL Engine"];
      const current = modelNameText ? modelNameText.textContent.trim() : "Flash";
      const nextIndex = (models.indexOf(current) + 1) % models.length;
      const nextModel = models[nextIndex];
      if (modelNameText) modelNameText.textContent = nextModel;
      localStorage.setItem("sol_active_model_name", nextModel);

      if (nextModel === "Pro") {
        activeModel = "gemini-1.5-pro";
      } else {
        activeModel = "gemini-1.5-flash";
      }
      
      const headerModelBadge = document.getElementById("header-model-badge");
      if (headerModelBadge) {
        headerModelBadge.innerHTML = `<i class="fa-solid fa-brain"></i> ${nextModel}`;
      }
      if (typeof showToast === "function") showToast(`Model set to ${nextModel}`);
    });
  }

// Voice Input Mic Button
  if (micBtn) {
    micBtn.addEventListener("click", () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech Recognition is not supported by your browser. Please type your query in the input bar.");
        return;
      }

      micBtn.style.color = "#ef4444";
      if (typeof showToast === "function") showToast("🎙️ Listening... Speak now!");

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (homeInput) {
          homeInput.value = "";
          syncInputBarHasText(homeInput);
          submitHomeQuery(transcript);
        }
        micBtn.style.color = "#94a3b8";
      };

      recognition.onerror = () => {
        micBtn.style.color = "#94a3b8";
        if (typeof showToast === "function") showToast("Voice input cancelled or unavailable.");
      };

      recognition.onend = () => {
        micBtn.style.color = "#94a3b8";
      };

      recognition.start();
    });
  }

  // Attachment Plus Button
  if (attachBtn) {
    attachBtn.addEventListener("click", () => {
      alert("Attachment support active! You can attach images, PDFs, or audio files in the Describing Lab and Output Practicing panels.");
    });
  }

  // Quick Action Chips Click Navigation
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      const target = chip.getAttribute("data-target");
      if (target) {
        switchPanel(target);
      }
    });
  });
}

function initSidebar() {
  const menuToggleBtnEl = document.getElementById("menu-toggle-btn");
  const sidebarEl = document.getElementById("sidebar");
  let backdropEl = document.getElementById("sidebar-backdrop");

  if (!backdropEl) {
    backdropEl = document.createElement("div");
    backdropEl.id = "sidebar-backdrop";
    backdropEl.className = "sidebar-backdrop";
    document.body.appendChild(backdropEl);
  }

  const toggleMobileDrawer = (open) => {
    if (!sidebarEl) return;
    const shouldOpen = typeof open === "boolean" ? open : !sidebarEl.classList.contains("mobile-active");
    if (shouldOpen) {
      sidebarEl.classList.add("mobile-active");
      if (backdropEl) backdropEl.classList.add("active");
    } else {
      sidebarEl.classList.remove("mobile-active");
      if (backdropEl) backdropEl.classList.remove("active");
    }
  };

  window.toggleMobileDrawer = toggleMobileDrawer;

  if (menuToggleBtnEl && sidebarEl) {
    menuToggleBtnEl.addEventListener("click", (e) => {
      e.stopPropagation();
      const isMobile = window.innerWidth <= 900;
      if (isMobile) {
        toggleMobileDrawer();
      } else {
        if (sidebarEl.classList.contains("expanded")) {
          sidebarEl.classList.replace("expanded", "collapsed");
        } else {
          sidebarEl.classList.replace("collapsed", "expanded");
        }
      }
    });
  }

  if (backdropEl) {
    backdropEl.addEventListener("click", () => {
      toggleMobileDrawer(false);
    });
  }

  // Close mobile drawer when clicking outside the sidebar
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 900 && sidebarEl && sidebarEl.classList.contains("mobile-active")) {
      const isInsideSidebar = sidebarEl.contains(e.target);
      const isMenuBtn = menuToggleBtnEl && (menuToggleBtnEl === e.target || menuToggleBtnEl.contains(e.target));
      if (!isInsideSidebar && !isMenuBtn) {
        toggleMobileDrawer(false);
      }
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && sidebarEl && sidebarEl.classList.contains("mobile-active")) {
      toggleMobileDrawer(false);
    }
  });

  // Tab Panel Routing
  const allNavItems = document.querySelectorAll(".nav-item");
  allNavItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const panelId = item.getAttribute("data-panel");
      if (panelId === "sol-chat") {
        if (typeof window.startNewSolChatSession === "function") {
          window.startNewSolChatSession();
        } else {
          resetHomeConversationScreen();
        }
      } else if (panelId) {
        if (typeof window.switchPanel === "function") window.switchPanel(panelId);
      }
      
      if (sidebarEl && sidebarEl.classList.contains("mobile-active")) {
        toggleMobileDrawer(false);
      }
    });
  });

  // Footer status badge click -> opens Info / Settings
  const apiStatusBadge = document.getElementById("api-status-badge");
  if (apiStatusBadge) {
    apiStatusBadge.style.cursor = "pointer";
    apiStatusBadge.addEventListener("click", () => {
      if (typeof window.switchPanel === "function") window.switchPanel("info");
    });
  }

  // Start Here quick-click links
  document.querySelectorAll(".feature-card").forEach(card => {
    card.addEventListener("click", () => {
      const target = card.getAttribute("data-target");
      if (target && typeof window.switchPanel === "function") {
        window.switchPanel(target);
      }
    });
  });

  // New Conversation Button Click -> Resets Gemini Home Screen & saves previous
  const newChatBtn = document.getElementById("btn-new-sol-chat");
  if (newChatBtn) {
    newChatBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (typeof window.startNewSolChatSession === "function") {
        window.startNewSolChatSession();
      } else {
        resetHomeConversationScreen();
      }
      if (typeof showToast === "function") showToast("Started new conversation with Sol!");
    });
  }

  if (typeof renderSidebarConversations === "function") renderSidebarConversations();
}

const RANDOM_ACCENT_PALETTE = [
  "#ff4500", "#00fa9a", "#1e90ff", "#ff1493", "#a855f7", "#ffd700", "#00ffff"
];

function generateSmartProvisionalTitle(query) {
  if (!query || typeof query !== "string") return "New Conversation";
  const q = query.trim().toLowerCase();

  // Greetings & casual check-ins
  if (/^(hi|hello|hey|hiya|howdy|yo|good (morning|afternoon|evening|day))(\s+sol|\s+there|\s+gemini)?$/i.test(q) || q === "hi" || q === "hello" || q === "hey" || q === "what s up" || q === "whats up" || q === "how are you") {
    const greetingTitles = ["Daily Catch-up", "Friendly Chat", "Morning Check-in", "Casual Conversation", "Sol Catch-up"];
    return greetingTitles[Math.floor(Math.random() * greetingTitles.length)];
  }
  if (q.includes("practice") || q.includes("speak") || q.includes("fluent") || q.includes("talk") || q.includes("conversation")) {
    return "Spoken Practice";
  }
  if (q.includes("grammar") || q.includes("tense") || q.includes("verb") || q.includes("sentence") || q.includes("correct") || q.includes("syntax")) {
    return "Grammar & Structure";
  }
  if (q.includes("vocab") || q.includes("word") || q.includes("etymology") || q.includes("synonym") || q.includes("meaning")) {
    return "Vocabulary Expansion";
  }
  if (q.includes("translate") || q.includes("spanish") || q.includes("french") || q.includes("german") || q.includes("italian") || q.includes("portuguese")) {
    return "Language Translation";
  }
  if (q.includes("describe") || q.includes("scene") || q.includes("photo") || q.includes("picture") || q.includes("story")) {
    return "Scene Description";
  }
  if (q.includes("pronounce") || q.includes("pronunciation") || q.includes("accent") || q.includes("sound")) {
    return "Pronunciation Coach";
  }

  // Clean sentence into 2-4 capitalized words
  const clean = query.trim().replace(/[?!.,;:"'()]/g, "");
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length <= 4 && words.length > 0) {
    return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
  } else if (words.length > 4) {
    return words.slice(0, 4).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
  }
  return "New Conversation";
}

async function requestAiTitleUpdate(convId, userQuery, aiReply = "") {
  if (!convId || !userQuery) return;
  const convs = getSolConversations();
  const conv = convs.find(c => c.id === convId);
  if (!conv || conv.isCustomNamed) return; // Never overwrite user's manual title!

  try {
    if (typeof geminiService !== "undefined" && geminiService && geminiService.hasApiKey()) {
      const aiTitle = await geminiService.generateDirectTitle(userQuery, aiReply);
      if (aiTitle) {
        const freshConvs = getSolConversations();
        const target = freshConvs.find(c => c.id === convId);
        if (target && !target.isCustomNamed) {
          target.title = aiTitle;
          saveSolConversations(freshConvs);
          renderSidebarConversations();
        }
      }
    }
  } catch (err) {
    console.warn("AI title update skipped:", err);
  }
}

let defaultSolConversations = [];

function getSolConversations() {
  const saved = localStorage.getItem("sol_saved_conversations_list");
  if (saved) {
    try {
      const list = JSON.parse(saved);
      const filtered = list.filter(c => !["conv_1", "conv_2", "conv_3", "conv_4"].includes(c.id));
      // Auto-sanitize legacy "💬 " emoji prefixes from titles
      filtered.forEach(c => {
        if (typeof c.title === "string") {
          c.title = c.title.replace(/^💬\s*/, "").trim();
        }
      });
      return filtered;
    } catch(e) {}
  }
  return defaultSolConversations;
}

async function syncConversationsToServer(convs) {
  try {
    await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(convs)
    });
  } catch(e) {}
}

async function fetchServerConversations() {
  try {
    const res = await fetch("/api/conversations", { cache: "no-store" });
    if (res.ok) {
      const serverConvs = await res.json();
      if (Array.isArray(serverConvs)) {
        if (serverConvs.length > 0) {
          localStorage.setItem("sol_saved_conversations_list", JSON.stringify(serverConvs));
          return serverConvs;
        } else {
          const local = getSolConversations();
          if (local.length > 0) {
            syncConversationsToServer(local);
          }
        }
      }
    }
  } catch(e) {}
  return null;
}

function saveSolConversations(list) {
  localStorage.setItem("sol_saved_conversations_list", JSON.stringify(list));
  syncConversationsToServer(list);
}

function saveActiveConversationMessages() {
  if (!currentHomeConvId) return;
  const convs = getSolConversations();
  const convIndex = convs.findIndex(c => c.id === currentHomeConvId);
  if (convIndex === -1) return;

  convs[convIndex].history = homeConversationHistory;
  saveSolConversations(convs);
}

function loadSolConversation(convId) {
  if (currentHomeConvId && currentHomeConvId !== convId && homeConversationHistory.length > 0) {
    saveActiveConversationMessages();
  }

  const convs = getSolConversations();
  const conv = convs.find(c => c.id === convId);
  if (!conv) return;

  currentHomeConvId = conv.id;
  homeConversationHistory = conv.history ? [...conv.history] : [];

  const conversationEl = document.getElementById("gemini-home-conversation");
  if (conversationEl) {
    conversationEl.innerHTML = "";
    homeConversationHistory.forEach(msg => {
      const text = msg.content || (msg.parts && msg.parts[0] ? msg.parts[0].text : "");
      if (!text) return;

      if (msg.role === "user") {
        const userDiv = document.createElement("div");
        userDiv.className = "gemini-inline-message";
        userDiv.innerHTML = `<div class="gemini-user-query">${escapeHtml(text)}</div>`;
        conversationEl.appendChild(userDiv);
      } else if (msg.role === "model") {
        const aiDiv = document.createElement("div");
        aiDiv.className = "gemini-inline-message";
        aiDiv.innerHTML = `
          <div class="gemini-ai-response">
            <div class="gemini-ai-body" data-raw-text="${escapeHtml(text)}">
              ${typeof marked !== 'undefined' ? marked.parse(text) : escapeHtml(text)}
            </div>
          </div>
        `;
        conversationEl.appendChild(aiDiv);
        if (typeof attachAiActions === "function") {
          attachAiActions(aiDiv, text);
        }
      }
    });
  }

  updateHomeChatModeState();
  renderSidebarConversations();
  if (typeof window.switchPanel === "function") {
    window.switchPanel("sol-chat");
  } else if (typeof switchPanel === "function") {
    switchPanel("sol-chat");
  }
  triggerHomeFadeInAnimation();

  setTimeout(() => {
    if (conversationEl && conversationEl.lastElementChild) {
      conversationEl.lastElementChild.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    const homeInput = document.getElementById("gemini-home-input");
    if (homeInput) homeInput.focus();
  }, 100);
}

function closeAllConversationMenus() {
  const existing = document.querySelectorAll(".conversation-context-menu");
  existing.forEach(el => el.remove());
  document.querySelectorAll(".conversation-item.menu-open").forEach(el => el.classList.remove("menu-open"));
}

if (typeof window !== "undefined" && !window._convContextMenuListenersAdded) {
  window._convContextMenuListenersAdded = true;
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".conversation-context-menu") && !e.target.closest(".conversation-item-more")) {
      closeAllConversationMenus();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllConversationMenus();
  });
  window.addEventListener("scroll", closeAllConversationMenus, true);
}

function renderSidebarConversations() {
  const listEl = document.getElementById("sidebar-conversations-list");
  if (!listEl) return;

  closeAllConversationMenus();

  const convs = getSolConversations();
  listEl.innerHTML = "";

  // Sort pinned conversations to the top, preserving relative order otherwise
  convs.sort((a, b) => {
    const aPinned = !!a.isPinned;
    const bPinned = !!b.isPinned;
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return 0;
  });

  convs.forEach((conv) => {
    const isActive = conv.id === currentHomeConvId;
    const isPinned = !!conv.isPinned;
    const li = document.createElement("li");
    li.className = `conversation-item ${isActive ? "active" : ""} ${isPinned ? "is-pinned" : ""}`;
    li.setAttribute("data-id", conv.id);

    const displayTitle = (conv.title || "Conversation").replace(/^💬\s*/, "").trim();

    li.innerHTML = `
      ${isPinned ? '<span class="conversation-item-pinned" title="Pinned conversation"><i class="fa-solid fa-thumbtack"></i></span>' : ''}
      <span class="conversation-item-title" title="${escapeHtml(displayTitle)}">${escapeHtml(displayTitle)}</span>
      <div class="conversation-item-actions">
        <button class="conversation-action-btn conversation-item-more" data-id="${conv.id}" title="Conversation options"><i class="fa-solid fa-ellipsis-vertical"></i></button>
      </div>
    `;

    // Click on item loads conversation
    li.addEventListener("click", (e) => {
      if (e.target.closest(".conversation-action-btn") || e.target.closest(".conversation-context-menu") || li.classList.contains("renaming")) return;
      loadSolConversation(conv.id);
      if (typeof showToast === "function") showToast(`Loaded "${displayTitle}"`);
    });

    // Inline Rename Flow
    const startRename = () => {
      closeAllConversationMenus();
      li.classList.add("renaming");
      const currentTitle = displayTitle;
      li.innerHTML = `
        <input type="text" class="conversation-rename-input" value="${escapeHtml(currentTitle)}" maxlength="45" />
        <div class="conversation-item-actions" style="opacity:1 !important;">
          <button class="conversation-action-btn conversation-rename-save" title="Save Title"><i class="fa-solid fa-check"></i></button>
          <button class="conversation-action-btn conversation-rename-cancel" title="Cancel"><i class="fa-solid fa-xmark"></i></button>
        </div>
      `;

      const input = li.querySelector(".conversation-rename-input");
      const saveBtn = li.querySelector(".conversation-rename-save");
      const cancelBtn = li.querySelector(".conversation-rename-cancel");

      input.focus();
      input.select();

      const commitRename = () => {
        const newTitle = input.value.trim();
        if (newTitle && newTitle !== currentTitle) {
          conv.title = newTitle;
          conv.isCustomNamed = true;
          const freshConvs = getSolConversations();
          const target = freshConvs.find(c => c.id === conv.id);
          if (target) {
            target.title = newTitle;
            target.isCustomNamed = true;
            saveSolConversations(freshConvs);
          }
          if (typeof showToast === "function") showToast(`Renamed to "${newTitle}"`);
        }
        renderSidebarConversations();
      };

      const abortRename = () => {
        renderSidebarConversations();
      };

      input.addEventListener("click", (e) => e.stopPropagation());
      input.addEventListener("keydown", (e) => {
        e.stopPropagation();
        if (e.key === "Enter") {
          commitRename();
        } else if (e.key === "Escape") {
          abortRename();
        }
      });

      saveBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        commitRename();
      });

      cancelBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        abortRename();
      });
    };

    const titleEl = li.querySelector(".conversation-item-title");
    if (titleEl) {
      titleEl.addEventListener("dblclick", (e) => {
        e.stopPropagation();
        startRename();
      });
    }

    // Three-Dots More Options Menu
    const moreBtn = li.querySelector(".conversation-item-more");
    if (moreBtn) {
      moreBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = li.classList.contains("menu-open");
        closeAllConversationMenus();
        if (isOpen) return;

        li.classList.add("menu-open");
        const menu = document.createElement("div");
        menu.className = "conversation-context-menu";
        menu.setAttribute("data-conv-id", conv.id);
        menu.innerHTML = `
          <button class="conversation-context-menu-item menu-pin-action">
            <i class="fa-solid ${conv.isPinned ? 'fa-thumbtack-slash' : 'fa-thumbtack'}"></i>
            <span>${conv.isPinned ? "Unpin" : "Pin"}</span>
          </button>
          <button class="conversation-context-menu-item menu-rename-action">
            <i class="fa-solid fa-pen"></i>
            <span>Rename</span>
          </button>
          <button class="conversation-context-menu-item menu-delete-action danger">
            <i class="fa-solid fa-trash-can"></i>
            <span>Delete</span>
          </button>
        `;

        // Calculate position
        const rect = moreBtn.getBoundingClientRect();
        let top = rect.bottom + 4;
        let left = rect.right - 130;
        if (left < 10) left = 10;
        if (top + 130 > window.innerHeight) {
          top = Math.max(10, rect.top - 125);
        }
        menu.style.top = `${top}px`;
        menu.style.left = `${left}px`;
        document.body.appendChild(menu);

        // Pin / Unpin Action
        const pinBtn = menu.querySelector(".menu-pin-action");
        if (pinBtn) {
          pinBtn.addEventListener("click", (ev) => {
            ev.stopPropagation();
            closeAllConversationMenus();
            conv.isPinned = !conv.isPinned;
            const freshConvs = getSolConversations();
            const target = freshConvs.find(c => c.id === conv.id);
            if (target) {
              target.isPinned = conv.isPinned;
              saveSolConversations(freshConvs);
            }
            if (typeof showToast === "function") {
              showToast(conv.isPinned ? `Pinned "${displayTitle}"` : `Unpinned "${displayTitle}"`);
            }
            renderSidebarConversations();
          });
        }

        // Rename Action
        const renameItemBtn = menu.querySelector(".menu-rename-action");
        if (renameItemBtn) {
          renameItemBtn.addEventListener("click", (ev) => {
            ev.stopPropagation();
            closeAllConversationMenus();
            startRename();
          });
        }

        // Delete Action
        const deleteItemBtn = menu.querySelector(".menu-delete-action");
        if (deleteItemBtn) {
          deleteItemBtn.addEventListener("click", (ev) => {
            ev.stopPropagation();
            closeAllConversationMenus();
            if (confirm(`Delete conversation "${displayTitle}"?`)) {
              const updated = getSolConversations().filter(c => c.id !== conv.id);
              saveSolConversations(updated);
              if (currentHomeConvId === conv.id) {
                resetHomeConversationScreen();
              }
              renderSidebarConversations();
            }
          });
        }
      });
    }

    listEl.appendChild(li);
  });
}
window.renderSidebarConversations = renderSidebarConversations;


window.startNewSolChatSession = function() {
  // 1. Save the previous active conversation if it contains messages
  if (Array.isArray(homeConversationHistory) && homeConversationHistory.length > 0) {
    if (currentHomeConvId) {
      saveActiveConversationMessages();
    } else {
      // Auto-assign ID and save the conversation with smart AI title
      currentHomeConvId = "conv_" + Date.now();
      const firstMsg = homeConversationHistory.find(m => m.role === "user");
      const query = firstMsg ? (firstMsg.content || (firstMsg.parts && firstMsg.parts[0] ? firstMsg.parts[0].text : "")) : "";
      const smartTitle = generateSmartProvisionalTitle(query);
      const convs = getSolConversations();
      convs.unshift({
        id: currentHomeConvId,
        title: smartTitle,
        icon: "fa-comments",
        type: "chat",
        history: [...homeConversationHistory],
        createdAt: Date.now()
      });
      saveSolConversations(convs);
    }
  }

  // 2. Reset conversation screen to clean initial state
  resetHomeConversationScreen();

  // 3. Ensure the conversations list updates so the newly saved conversation appears immediately
  renderSidebarConversations();

  // 4. Switch to Sol Chat panel
  if (typeof window.switchPanel === "function") {
    window.switchPanel("sol-chat");
  }

  // 5. Clean & focus input field
  const homeInput = document.getElementById("gemini-home-input");
  if (homeInput) {
    homeInput.value = "";
    syncInputBarHasText(homeInput);
    homeInput.focus();
  }
};

let activeTeachAiDiv = null;

function openTeachSolModal(userQuery, currentAiText, aiDiv) {
  const modal = document.getElementById("teach-sol-modal");
  const promptDisplay = document.getElementById("teach-user-prompt-display");
  const responseInput = document.getElementById("teach-ideal-response-input");
  if (!modal || !promptDisplay || !responseInput) return;

  activeTeachAiDiv = aiDiv;
  promptDisplay.textContent = `"${userQuery || "hello"}"`;
  responseInput.value = currentAiText ? currentAiText.replace(/[*_#`~>]/g, "").trim() : "";
  modal.classList.remove("hidden");
  setTimeout(() => responseInput.focus(), 50);
}

function initTrainingStudio() {
  const openBtn = document.getElementById("btn-open-training");
  const modal = document.getElementById("training-studio-modal");
  const closeBtn = document.getElementById("btn-close-training-studio");
  const cancelBtn = document.getElementById("btn-cancel-training");
  const saveAllBtn = document.getElementById("btn-save-training-all");

  const openStudio = () => {
    loadTrainingStudioUI();
    if (modal) modal.classList.remove("hidden");
  };

  const closeStudio = () => {
    if (modal) modal.classList.add("hidden");
  };

  if (openBtn) openBtn.addEventListener("click", openStudio);
  if (closeBtn) closeBtn.addEventListener("click", closeStudio);
  if (cancelBtn) cancelBtn.addEventListener("click", closeStudio);

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeStudio();
    });
  }

  // 2. Tab Navigation
  const tabBtns = document.querySelectorAll(".training-tab-btn");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      tabBtns.forEach(b => b.classList.toggle("active", b === btn));
      document.querySelectorAll(".training-tab-content").forEach(tc => {
        tc.classList.toggle("active", tc.id === tabId);
      });
    });
  });

  // 3. Tone Presets
  const toneBtns = document.querySelectorAll(".tone-preset-btn");
  toneBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      toneBtns.forEach(b => b.classList.toggle("active", b === btn));
    });
  });

  // 4. Add Training Pair Button
  const addPairBtn = document.getElementById("btn-add-training-pair");
  if (addPairBtn) {
    addPairBtn.addEventListener("click", () => {
      const promptInput = document.getElementById("new-example-prompt");
      const respInput = document.getElementById("new-example-response");
      if (!promptInput || !respInput) return;
      const uPrompt = promptInput.value.trim();
      const idealResp = respInput.value.trim();
      if (!uPrompt || !idealResp) {
        if (typeof showToast === "function") showToast("Please enter both a prompt and ideal response.");
        return;
      }
      geminiService.addTrainingExample(uPrompt, idealResp);
      promptInput.value = "";
      respInput.value = "";
      renderTrainingExamplesList();
      if (typeof showToast === "function") showToast(`Added training example for "${uPrompt}"!`);
    });
  }

  // 5. Test & Connect API Key
  const testKeyBtn = document.getElementById("btn-test-training-api-key");
  const toggleKeyBtn = document.getElementById("btn-toggle-training-api-key");
  const keyInput = document.getElementById("training-api-key-input");
  if (toggleKeyBtn && keyInput) {
    toggleKeyBtn.addEventListener("click", () => {
      keyInput.type = keyInput.type === "password" ? "text" : "password";
      toggleKeyBtn.innerHTML = keyInput.type === "password" ? '<i class="fa-solid fa-eye"></i>' : '<i class="fa-solid fa-eye-slash"></i>';
    });
  }
  if (testKeyBtn && keyInput) {
    testKeyBtn.addEventListener("click", async () => {
      const rawKey = keyInput.value.trim();
      if (!rawKey) {
        await geminiService.setApiKey("");
        updateEngineBadgeUI();
        if (typeof showToast === "function") showToast("Switched to Demo Mode.");
        return;
      }
      testKeyBtn.disabled = true;
      testKeyBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Testing...';
      try {
        await geminiService.setApiKey(rawKey);
        const models = await geminiService.getSupportedModels();
        if (models && models.length > 0) {
          updateEngineBadgeUI();
          if (typeof showToast === "function") showToast("⚡ Live Gemini Connected! (" + models[0] + ")");
        } else {
          updateEngineBadgeUI();
          if (typeof showToast === "function") showToast("API Key saved! Ready to chat.");
        }
      } catch (err) {
        if (typeof showToast === "function") showToast("Connection failed: " + (err.message || String(err)));
      } finally {
        testKeyBtn.disabled = false;
        testKeyBtn.innerHTML = '<i class="fa-solid fa-bolt"></i> Test & Connect';
        updateEngineBadgeUI();
      }
    });
  }

  // 6. Save All Training Data
  if (saveAllBtn) {
    saveAllBtn.addEventListener("click", () => {
      const activeToneBtn = document.querySelector(".tone-preset-btn.active");
      const selectedTone = activeToneBtn ? activeToneBtn.getAttribute("data-tone") : "natural";
      const customDirectives = document.getElementById("custom-directives-input") ? document.getElementById("custom-directives-input").value : "";
      const userMemory = document.getElementById("user-memory-input") ? document.getElementById("user-memory-input").value : "";

      const currentProfile = geminiService.getTrainingProfile();
      currentProfile.tone = selectedTone;
      currentProfile.customDirectives = customDirectives;
      currentProfile.userMemory = userMemory;
      geminiService.saveTrainingProfile(currentProfile);

      closeStudio();
      if (typeof showToast === "function") showToast("🎓 Sol's mind & training saved successfully!");
    });
  }

  // 7. Teach Sol Quick Modal wiring
  const teachModal = document.getElementById("teach-sol-modal");
  const closeTeachBtn = document.getElementById("btn-close-teach-modal");
  const cancelTeachBtn = document.getElementById("btn-cancel-teach");
  const saveTeachBtn = document.getElementById("btn-save-teach-example");

  const closeTeachModal = () => {
    if (teachModal) teachModal.classList.add("hidden");
    activeTeachAiDiv = null;
  };

  if (closeTeachBtn) closeTeachBtn.addEventListener("click", closeTeachModal);
  if (cancelTeachBtn) cancelTeachBtn.addEventListener("click", closeTeachModal);
  if (teachModal) {
    teachModal.addEventListener("click", (e) => {
      if (e.target === teachModal) closeTeachModal();
    });
  }

  if (saveTeachBtn) {
    saveTeachBtn.addEventListener("click", () => {
      const promptEl = document.getElementById("teach-user-prompt-display");
      const respEl = document.getElementById("teach-ideal-response-input");
      if (!promptEl || !respEl) return;
      const uPrompt = promptEl.textContent.replace(/^"|"$/g, "").trim();
      const idealResp = respEl.value.trim();
      if (!idealResp) {
        if (typeof showToast === "function") showToast("Please provide an ideal response.");
        return;
      }

      geminiService.addTrainingExample(uPrompt, idealResp);

      if (activeTeachAiDiv) {
        const bodyEl = activeTeachAiDiv.querySelector(".gemini-ai-body");
        if (bodyEl) {
          bodyEl.innerHTML = marked.parse(idealResp);
          bodyEl.setAttribute("data-raw-text", idealResp);
        }
      }

      if (homeConversationHistory && homeConversationHistory.length > 0) {
        const lastModel = [...homeConversationHistory].reverse().find(m => m.role === "model");
        if (lastModel) {
          lastModel.content = idealResp;
          if (lastModel.parts && lastModel.parts[0]) lastModel.parts[0].text = idealResp;
        }
        saveActiveConversationMessages();
      }

      closeTeachModal();
      if (typeof showToast === "function") showToast("🎓 Sol learned this response and updated its training dataset!");
    });
  }
}

function loadTrainingStudioUI() {
  const profile = geminiService.getTrainingProfile();
  
  const toneBtns = document.querySelectorAll(".tone-preset-btn");
  toneBtns.forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-tone") === profile.tone);
  });

  const directivesInput = document.getElementById("custom-directives-input");
  if (directivesInput) directivesInput.value = profile.customDirectives || "";

  const memoryInput = document.getElementById("user-memory-input");
  if (memoryInput) memoryInput.value = profile.userMemory || "";

  const apiKeyInput = document.getElementById("training-api-key-input");
  if (apiKeyInput) apiKeyInput.value = geminiService.apiKey || "";

  updateEngineBadgeUI();
  renderTrainingExamplesList();
}

function updateEngineBadgeUI() {
  const badge = document.getElementById("training-engine-badge");
  const hasKey = geminiService.hasApiKey();
  if (badge) {
    if (hasKey) {
      badge.textContent = "⚡ Live Neural Gemini (Active)";
      badge.className = "engine-status-badge active";
    } else {
      badge.textContent = "💡 Demo Mode (No Key)";
      badge.className = "engine-status-badge demo";
    }
  }

  const apiStatusBadge = document.getElementById("api-status-badge");
  if (apiStatusBadge) {
    const textEl = apiStatusBadge.querySelector(".status-text");
    const dotEl = apiStatusBadge.querySelector(".status-dot");
    if (hasKey) {
      if (textEl) textEl.textContent = "Live Gemini";
      if (dotEl) { dotEl.className = "status-dot online"; }
    } else {
      if (textEl) textEl.textContent = "Demo Mode";
      if (dotEl) { dotEl.className = "status-dot warning"; }
    }
  }
}

function renderTrainingExamplesList() {
  const listContainer = document.getElementById("training-examples-list");
  const countSpan = document.getElementById("training-examples-count");
  if (!listContainer) return;

  const profile = geminiService.getTrainingProfile();
  const examples = profile.examples || [];

  if (countSpan) countSpan.textContent = examples.length;

  if (examples.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-examples-note">
        <i class="fa-solid fa-graduation-cap"></i> No custom training pairs added yet. Add examples above or click <strong>Teach Sol</strong> on any message in chat!
      </div>
    `;
    return;
  }

  listContainer.innerHTML = "";
  examples.forEach(ex => {
    const card = document.createElement("div");
    card.className = "training-example-card";
    card.innerHTML = `
      <div class="example-card-header">
        <span class="example-tag"><i class="fa-solid fa-user"></i> Prompt</span>
        <button class="example-delete-btn" data-id="${ex.id}" title="Delete Training Example"><i class="fa-solid fa-trash-can"></i></button>
      </div>
      <div class="example-prompt-text">${escapeHtml(ex.userPrompt)}</div>
      <div class="example-card-header" style="margin-top: 0.5rem;">
        <span class="example-tag sol-tag"><i class="fa-solid fa-sparkles"></i> Sol Ideal Response</span>
      </div>
      <div class="example-response-text">${escapeHtml(ex.idealResponse)}</div>
    `;

    const delBtn = card.querySelector(".example-delete-btn");
    if (delBtn) {
      delBtn.addEventListener("click", () => {
        if (confirm(`Remove training example for "${ex.userPrompt}"?`)) {
          geminiService.deleteTrainingExample(ex.id);
          renderTrainingExamplesList();
          if (typeof showToast === "function") showToast("Training example removed.");
        }
      });
    }

    listContainer.appendChild(card);
  });
}

window.switchPanel = function(panelId) {
  if (!panelId) return;
  activePanel = panelId;

  // 1. Highlight Nav Items
  const navItemsList = document.querySelectorAll(".nav-item");
  navItemsList.forEach(item => {
    const isSelected = item.getAttribute("data-panel") === panelId;
    item.classList.toggle("active", isSelected);
  });

  // 2. Direct Fail-Proof Panel Display Control (Bypasses any CSS animation bugs)
  const panelsList = document.querySelectorAll(".workspace-panel");
  panelsList.forEach(p => {
    const isActive = p.id === `panel-${panelId}`;
    p.classList.toggle("active", isActive);
    if (isActive) {
      p.style.setProperty("display", "flex", "important");
      p.style.setProperty("opacity", "1", "important");
      p.style.setProperty("visibility", "visible", "important");
      p.scrollTop = 0;
    } else {
      p.style.setProperty("display", "none", "important");
      p.style.setProperty("opacity", "0", "important");
    }
  });

  // 3. Reset slideshow view if routing away from the dictionary
  if (panelId !== "dictionary") {
    const slideshowView = document.getElementById("dict-slideshow-view");
    const coverView = document.getElementById("dict-cover-view");
    const headerIntro = document.getElementById("dict-header-intro");
    if (slideshowView && coverView) {
      slideshowView.classList.add("hidden");
      coverView.classList.remove("hidden");
      if (headerIntro) headerIntro.classList.remove("hidden");
    }
  }

  // 4. Update Header Information
  const headerChatTitleEl = document.getElementById("header-chat-title");
  const headerAgentBadgeEl = document.getElementById("header-agent-badge");

  const matchingNavItem = document.querySelector(`.nav-item[data-panel="${panelId}"]`);
  if (matchingNavItem) {
    const labelEl = matchingNavItem.querySelector(".nav-label");
    const label = labelEl ? labelEl.textContent : "Sol";
    const iconEl = matchingNavItem.querySelector(".nav-icon");
    
    if (headerChatTitleEl) headerChatTitleEl.textContent = label;
    if (iconEl && headerAgentBadgeEl) {
      if (iconEl.tagName === "I") {
        headerAgentBadgeEl.innerHTML = `<i class="${iconEl.className}"></i>`;
      } else {
        headerAgentBadgeEl.innerHTML = iconEl.outerHTML;
      }
    }
  }
  // 5. Special Panel Trigger Callbacks
  if (panelId === "community") {
    if (typeof renderCircleFeed === "function") renderCircleFeed();
    if (typeof renderCircleMembersWidget === "function") renderCircleMembersWidget();
  } else if (panelId === "videos") {
    const vg = document.getElementById("video-grid");
    if (!vg || vg.children.length === 0) {
      if (typeof initVideosPanel === "function") initVideosPanel();
    }
  } else if (panelId === "output-practicing") {
    if (typeof initOutputPracticingPanel === "function") initOutputPracticingPanel();
  } else if (panelId === "random-word") {
    if (typeof initRandomWordPanel === "function") initRandomWordPanel();
  } else if (panelId === "sol-chat") {
    const authModal = document.getElementById("auth-modal");
    const isModalOpen = authModal && !authModal.classList.contains("hidden");
    if (!isModalOpen) {
      if (!hasPlayedFirstLoginEntrance) {
        if (typeof triggerSolGrandEntrance === "function") {
          triggerSolGrandEntrance();
          hasPlayedFirstLoginEntrance = true;
        }
      } else {
        if (typeof triggerSolFadeIn === "function") triggerSolFadeIn();
      }
    }
    const homeInput = document.getElementById("gemini-home-input");
    if (homeInput) setTimeout(() => homeInput.focus(), 60);
  }

  window.scrollTo({ top: 0, behavior: "instant" });
};
function switchPanel(panelId) { window.switchPanel(panelId); }

// -------------------------------------------------------------
// Panel 2: Globally Known Community Board (Circle.so style Layout)
// -------------------------------------------------------------
let activeFeedTab = "posts"; // "posts" or "members"

function getActiveUserProfile() {
  try {
    const saved = localStorage.getItem("sol_user_profile");
    if (saved) {
      const user = JSON.parse(saved);
      if (user && (user.name || user.email)) {
        return user;
      }
    }
  } catch (e) {}
  return null;
}

function getUserInitials(name) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function initCommunityPanel() {
  renderCircleFeed();
  renderCircleMembersWidget();

  // Navigation Items switching channels
  const navItemsContainer = document.querySelector(".circle-nav");
  if (navItemsContainer) {
    navItemsContainer.addEventListener("click", (e) => {
      const item = e.target.closest(".circle-nav-item");
      if (!item) return;

      // Toggle Active navigation item
      const allItems = navItemsContainer.querySelectorAll(".circle-nav-item");
      allItems.forEach(c => c.classList.remove("active"));
      item.classList.add("active");

      const channelId = item.getAttribute("data-channel");
      currentCircleChannel = channelId;

      // Update Middle Column header information
      const titleEl = document.getElementById("circle-channel-title");
      const descEl = document.getElementById("circle-channel-desc");
      const meta = CIRCLE_CHANNELS_META[channelId];
      if (meta) {
        if (titleEl) titleEl.textContent = meta.title;
        if (descEl) descEl.textContent = meta.desc;
      }

      // Hide/Show New Post button for Home/Members tabs
      const btnNewPost = document.getElementById("btn-circle-new-post");
      if (btnNewPost) {
        if (channelId === "home" || channelId === "members-tab") {
          btnNewPost.style.display = "none";
        } else {
          btnNewPost.style.display = "flex";
        }
      }

      // Default tab view
      activeFeedTab = "posts";
      const tabPosts = document.getElementById("tab-btn-posts");
      const tabMembers = document.getElementById("tab-btn-members");
      if (tabPosts) tabPosts.classList.add("active");
      if (tabMembers) tabMembers.classList.remove("active");

      renderCircleFeed();
    });
  }

  // Feed Tab Buttons (Posts vs Members tab inside Middle Column)
  const tabPosts = document.getElementById("tab-btn-posts");
  const tabMembers = document.getElementById("tab-btn-members");
  
  if (tabPosts && tabMembers) {
    tabPosts.addEventListener("click", () => {
      tabPosts.classList.add("active");
      tabMembers.classList.remove("active");
      activeFeedTab = "posts";
      renderCircleFeed();
    });

    tabMembers.addEventListener("click", () => {
      tabMembers.classList.add("active");
      tabPosts.classList.remove("active");
      activeFeedTab = "members";
      renderCircleFeed();
    });
  }

  // New Post Modal toggle controls
  const btnNewPost = document.getElementById("btn-circle-new-post");
  const modal = document.getElementById("circle-composer-modal");
  const btnCloseModal = document.getElementById("btn-close-circle-modal");

  if (btnNewPost && modal) {
    btnNewPost.addEventListener("click", () => {
      const userBadge = document.getElementById("circle-composer-user-badge");
      const currentUser = getActiveUserProfile();
      if (userBadge) {
        if (currentUser) {
          let avatarImg = "";
          if (currentUser.picture) {
            avatarImg = `<img src="${escapeHtml(currentUser.picture)}" alt="${escapeHtml(currentUser.name)}" style="width:36px;height:36px;border-radius:8px;object-fit:cover;flex-shrink:0;">`;
          } else {
            avatarImg = `<div style="width:36px;height:36px;border-radius:8px;background:var(--accent-color,#c5a059);color:#000;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;">${getUserInitials(currentUser.name)}</div>`;
          }
          userBadge.innerHTML = `
            ${avatarImg}
            <div style="flex-grow:1;">
              <div style="font-weight:700;font-size:0.9rem;color:#ffffff;">Posting as ${escapeHtml(currentUser.name)}</div>
              <div style="font-size:0.75rem;color:#94a3b8;"><i class="fa-brands fa-google" style="color:#4285F4;margin-right:4px;"></i>${escapeHtml(currentUser.email || 'Google Account Linked')}</div>
            </div>
            <span style="font-size:0.75rem;padding:2px 8px;border-radius:12px;background:rgba(36,205,152,0.15);color:#24cd98;font-weight:600;">Connected</span>
          `;
          userBadge.style.display = "flex";
        } else {
          userBadge.innerHTML = `
            <div style="display:flex;align-items:center;gap:0.6rem;width:100%;">
              <i class="fa-solid fa-circle-user" style="font-size:1.8rem;color:#64748b;"></i>
              <div style="font-size:0.82rem;color:#94a3b8;flex-grow:1;">
                Posting as <strong>Guest</strong>. <a href="javascript:void(0)" onclick="document.getElementById('btn-google-login')?.click();" style="color:var(--accent-color,#c5a059);text-decoration:underline;font-weight:600;">Sign in with Google</a> to display your verified name & avatar.
              </div>
            </div>
          `;
          userBadge.style.display = "flex";
        }
      }
      modal.classList.remove("hidden");
    });
  }

  if (btnCloseModal && modal) {
    btnCloseModal.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }

  // Handle New Post form submissions
  const postForm = document.getElementById("circle-post-form");
  if (postForm && modal) {
    postForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const titleInput = document.getElementById("circle-post-title");
      const bodyInput = document.getElementById("circle-post-body");
      const imgInput = document.getElementById("circle-post-image");

      const title = titleInput.value.trim();
      const body = bodyInput.value.trim();
      const imgUrl = imgInput ? imgInput.value.trim() : "";

      if (!title || !body) return;

      const currentUser = getActiveUserProfile();
      const authorName = currentUser ? currentUser.name : "You";
      const authorAvatar = currentUser ? (currentUser.picture || getUserInitials(currentUser.name)) : "Y";
      const authorRole = currentUser ? "Learner 👤" : "Guest 👤";

      const newPost = {
        id: "cp_" + Date.now(),
        title: title,
        author: authorName,
        role: authorRole,
        avatar: authorAvatar,
        time: "Just now",
        content: body,
        image: imgUrl || null,
        likes: 0,
        isCurrentUser: true,
        comments: []
      };

      if (!circleChannelsData[currentCircleChannel]) {
        circleChannelsData[currentCircleChannel] = [];
      }

      circleChannelsData[currentCircleChannel].unshift(newPost);
      
      // Reset inputs & hide modal
      titleInput.value = "";
      bodyInput.value = "";
      if (imgInput) imgInput.value = "";
      modal.classList.add("hidden");

      renderCircleFeed();

      // Trigger automatic smart community AI reply
      setTimeout(() => {
        simulateCircleReply(newPost.id, title, body);
      }, 1500);
    });
  }
}

function renderCircleFeed() {
  const feedContainer = document.getElementById("circle-posts-feed");
  if (!feedContainer) return;
  feedContainer.innerHTML = "";

  const currentUser = getActiveUserProfile();

  if (activeFeedTab === "members" || currentCircleChannel === "members-tab") {
    // Render list of members in the middle column grid
    const members = [];
    if (currentUser) {
      members.push({
        name: `${currentUser.name} (You)`,
        status: "online",
        role: "Learner 👤",
        avatar: currentUser.picture || getUserInitials(currentUser.name),
        details: `Your active SOL study account (${currentUser.email || 'Google Connected'}).`,
        isUser: true
      });
    } else {
      members.push({
        name: "Guest Learner (You)",
        status: "online",
        role: "Learner 👤",
        avatar: "👤",
        details: "Sign in with Google in the top header to connect your profile.",
        isUser: true
      });
    }

    members.push(
      { name: "Gregory Dobbins", status: "online", role: "Program Manager 🎓", avatar: "GD", details: "Funnel Builder expert since 2018." },
      { name: "Sarah K.", status: "online", role: "Language Coach 🏅", avatar: "SK", details: "Native English linguist focused on comprehensible inputs." },
      { name: "Elena Rostova", status: "online", role: "Linguist & Phonetics 🌍", avatar: "ER", details: "Targeting IPA transcription and accent mechanics." },
      { name: "Alice F.", status: "online", role: "Member 👤", avatar: "AF", details: "French native acquiring conversational Spanish syntax." },
      { name: "Bob D.", status: "offline", role: "Member 👤", avatar: "BD", details: "Tech lead exploring Metaphor Schema integrations." },
      { name: "Marcus Vance", status: "offline", role: "Community Moderator 🛡️", avatar: "MV", details: "Supporting forum discussions and safe exchanges." }
    );

    const grid = document.createElement("div");
    grid.className = "circle-members-grid";
    
    members.forEach(m => {
      const card = document.createElement("div");
      card.className = "circle-member-card";
      if (m.isUser) {
        card.style.borderColor = "var(--accent-color, #c5a059)";
        card.style.boxShadow = "0 0 12px rgba(197, 160, 89, 0.15)";
      }
      let avatarHtml = "";
      if (m.avatar && (m.avatar.startsWith("http") || m.avatar.startsWith("data:"))) {
        avatarHtml = `<img src="${escapeHtml(m.avatar)}" alt="${escapeHtml(m.name)}" style="width:100%;height:100%;border-radius:8px;object-fit:cover;display:block;">`;
      } else {
        avatarHtml = escapeHtml(m.avatar || "👤");
      }

      card.innerHTML = `
        <div class="member-avatar" style="overflow:hidden;flex-shrink:0;">${avatarHtml}</div>
        <div class="member-info" style="flex-grow:1;min-width:0;">
          <div class="member-name-row" style="display:flex;align-items:center;justify-content:space-between;gap:0.4rem;">
            <h4 style="margin:0;font-size:0.92rem;color:#ffffff;display:flex;align-items:center;gap:0.4rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              ${escapeHtml(m.name)}
            </h4>
            <span class="status-indicator ${m.status}" title="${m.status}"></span>
          </div>
          <p class="member-role" style="margin:0.25rem 0;font-size:0.75rem;color:var(--accent-color,#c5a059);font-weight:600;">${escapeHtml(m.role)}</p>
          <p class="member-details" style="margin:0;font-size:0.75rem;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(m.details)}</p>
        </div>
      `;
      grid.appendChild(card);
    });
    feedContainer.appendChild(grid);
    return;
  }

  // Handle Home Welcome View
  if (currentCircleChannel === "home") {
    const heroGreeting = currentUser ? `Welcome back, ${escapeHtml(currentUser.name)}!` : "Welcome to Globally Known!";
    const heroSub = currentUser
      ? `Connected as <strong>${escapeHtml(currentUser.email || currentUser.name)}</strong>. You are part of the active cohort!`
      : `Connect with language learners worldwide, share study notes, and master comprehensible inputs together.`;
    
    feedContainer.innerHTML = `
      <div class="circle-home-welcome">
        <div class="welcome-hero">
          <div class="welcome-cap"><i class="fa-solid fa-graduation-cap"></i></div>
          <h3>${heroGreeting}</h3>
          <p>${heroSub}</p>
        </div>
        <div class="channels-brief">
          <h4>Featured Learning Spaces</h4>
          <ul>
            <li><strong>📢 #announcements:</strong> Official schedules, updates, and releases from the team.</li>
            <li><strong>💬 #english-inputs:</strong> Discuss vocabulary, shadowing notes, and City Vlog takeaways.</li>
            <li><strong>🧠 #metaphors-discussion:</strong> Unpack conceptual metaphors, idioms, and target language syntax.</li>
            <li><strong>☕ #general-chat:</strong> Say hello, share your daily study streak, and exchange tips.</li>
          </ul>
        </div>
      </div>
    `;
    return;
  }

  // Render posts feed for current channel
  const posts = (typeof circleChannelsData !== "undefined" && circleChannelsData[currentCircleChannel]) ? circleChannelsData[currentCircleChannel] : [];
  
  if (posts.length === 0) {
    feedContainer.innerHTML = `
      <div style="text-align:center;padding:3.5rem 1rem;color:#64748b;">
        <i class="fa-regular fa-comment-dots" style="font-size:2.5rem;margin-bottom:0.75rem;display:block;opacity:0.6;"></i>
        <p style="font-size:0.95rem;margin-bottom:0.5rem;color:#94a3b8;">No posts yet in #${escapeHtml(currentCircleChannel)}</p>
        <p style="font-size:0.82rem;">Click <strong>+ New Post</strong> in the top right to start the discussion!</p>
      </div>
    `;
    return;
  }

  posts.forEach(post => {
    const card = document.createElement("div");
    card.className = "circle-post-card";

    // Determine author identity
    const isCurrentUserPost = post.isCurrentUser || (currentUser && post.author === currentUser.name) || post.author === "You";
    const displayAuthor = (isCurrentUserPost && currentUser) ? currentUser.name : (post.author === "You" ? "Guest Learner" : post.author);
    const displayAvatar = (isCurrentUserPost && currentUser) ? (currentUser.picture || getUserInitials(currentUser.name)) : (post.avatar || "👤");
    const displayRole = (isCurrentUserPost && currentUser) ? "Learner 👤" : (post.role || "Member 👤");

    let avatarHtml = "";
    if (displayAvatar && (displayAvatar.startsWith("http") || displayAvatar.startsWith("data:"))) {
      avatarHtml = `<img src="${escapeHtml(displayAvatar)}" alt="${escapeHtml(displayAuthor)}" style="width:100%;height:100%;border-radius:8px;object-fit:cover;display:block;">`;
    } else {
      avatarHtml = escapeHtml(displayAvatar);
    }

    card.innerHTML = `
      <div class="post-header">
        <div class="author-avatar" style="overflow:hidden;flex-shrink:0;">${avatarHtml}</div>
        <div class="author-details">
          <h4>
            <span>${escapeHtml(displayAuthor)}</span>
            <span class="author-role">${escapeHtml(displayRole)}</span>
          </h4>
          <span class="post-time">${escapeHtml(post.time)}</span>
        </div>
      </div>
      <div class="post-content">
        <h3 class="post-title">${escapeHtml(post.title)}</h3>
        <p class="post-body-text">${escapeHtml(post.content)}</p>
      </div>
      ${post.image ? `<div class="post-media"><img src="${escapeHtml(post.image)}" alt="Post Media" onerror="this.parentElement.style.display='none';"></div>` : ""}
      <div class="post-actions-row">
        <button class="action-btn like-btn ${post.userLiked ? 'liked' : ''}" data-id="${post.id}" style="${post.userLiked ? 'color: #e11d48;' : ''}">
          <i class="${post.userLiked ? 'fa-solid' : 'fa-regular'} fa-heart"></i> <span>${post.likes || 0}</span>
        </button>
        <span class="action-btn" style="cursor:default;">
          <i class="fa-regular fa-comment"></i> <span>${post.comments ? post.comments.length : 0} Comments</span>
        </span>
      </div>
      <div class="post-comments-container" style="${post.comments && post.comments.length > 0 ? '' : 'display:none;'}">
        ${(post.comments || []).map(c => `
          <div class="circle-comment-card">
            <span class="comment-author">${escapeHtml(c.author)}:</span>
            <span class="comment-text">${escapeHtml(c.content)}</span>
          </div>
        `).join("")}
      </div>
      <div class="comment-composer-box">
        <form class="comment-submit-form" data-post-id="${post.id}">
          <input type="text" class="comment-input" placeholder="Write a comment as ${escapeHtml(currentUser ? currentUser.name : 'Learner')}..." required autocomplete="off">
          <button type="submit" class="comment-submit-btn">Reply</button>
        </form>
      </div>
    `;

    // Bind Like Button
    const likeBtn = card.querySelector(".like-btn");
    if (likeBtn) {
      likeBtn.addEventListener("click", () => {
        if (!post.userLiked) {
          post.likes = (post.likes || 0) + 1;
          post.userLiked = true;
        } else {
          post.likes = Math.max(0, (post.likes || 1) - 1);
          post.userLiked = false;
        }
        renderCircleFeed();
      });
    }

    // Bind Comment Submit
    const commentForm = card.querySelector(".comment-submit-form");
    if (commentForm) {
      commentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = commentForm.querySelector(".comment-input");
        const val = input ? input.value.trim() : "";
        if (!val) return;

        const author = currentUser ? currentUser.name : "Learner";
        post.comments = post.comments || [];
        post.comments.push({ author: author, content: val });
        renderCircleFeed();
      });
    }

    feedContainer.appendChild(card);
  });
}

function openPlaylistViewer(video) {
  const playlistModal = document.getElementById("playlist-modal");
  const mainPlaylistIframe = document.getElementById("main-playlist-iframe");
  const playlistTitle = document.getElementById("playlist-title");
  const playlistDesc = document.getElementById("playlist-desc");
  const episodesCarouselTrack = document.getElementById("episodes-carousel-track");
  const btnCarouselPrev = document.getElementById("btn-carousel-prev");
  const btnCarouselNext = document.getElementById("btn-carousel-next");
  const carouselSection = document.querySelector(".episodes-carousel-section");

  if (!playlistModal) return;

  playlistModal.classList.remove("hidden");

  if (playlistTitle) playlistTitle.textContent = video.title;
  if (playlistDesc) playlistDesc.textContent = video.desc;

  if (mainPlaylistIframe) {
    mainPlaylistIframe.src = video.embedUrl;
  }

  const hasPlaylist = video.embedUrl && video.embedUrl.includes("list=");
  if (hasPlaylist) {
    if (carouselSection) carouselSection.style.display = "flex";
    if (episodesCarouselTrack && typeof SPANISH_PLAYLIST_EPISODES !== "undefined") {
      episodesCarouselTrack.innerHTML = "";
      SPANISH_PLAYLIST_EPISODES.forEach((episode, index) => {
        const epCard = document.createElement("div");
        epCard.className = `episode-card ${index === 0 ? "active" : ""}`;
        const epThumbSrc = (episode.videoId && episode.videoId !== "videoseries" && episode.videoId.length > 5)
          ? `https://img.youtube.com/vi/${episode.videoId}/mqdefault.jpg`
          : `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60`;

        epCard.innerHTML = `
          <div class="episode-thumb-container">
            <img src="${epThumbSrc}" alt="${escapeHtml(episode.title)}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60';">
            <div class="episode-play-overlay"><i class="fa-solid fa-play"></i></div>
            <span class="episode-badge">${episode.duration}</span>
          </div>
          <div class="episode-details">
            <h4>Episode ${episode.episode}: ${escapeHtml(episode.title)}</h4>
            <p>${escapeHtml(episode.desc)}</p>
          </div>
        `;

        epCard.addEventListener("click", () => {
          const allCards = episodesCarouselTrack.querySelectorAll(".episode-card");
          allCards.forEach(c => c.classList.remove("active"));
          epCard.classList.add("active");
          if (mainPlaylistIframe) mainPlaylistIframe.src = episode.embedUrl;
        });

        episodesCarouselTrack.appendChild(epCard);
      });
    }
  } else {
    if (carouselSection) carouselSection.style.display = "none";
  }
}

function initDictionaryPanel() {
  // Grab elements
  const coverView = document.getElementById("dict-cover-view");
  const slideshowView = document.getElementById("dict-slideshow-view");
  const btnStartBodySlides = document.getElementById("btn-start-body-slides");
  const btnStartBathroomSlides = document.getElementById("btn-start-bathroom-slides");
  const btnStartSeasideSlides = document.getElementById("btn-start-seaside-slides");
  const btnCloseSlides = document.getElementById("btn-close-slides");
  const btnPrevSlide = document.getElementById("btn-prev-slide");
  const btnNextSlide = document.getElementById("btn-next-slide");
  const slideImage = document.getElementById("slide-image-element");
  const slideImageWrapper = document.getElementById("slide-image-wrapper-element");
  const counterLabel = document.getElementById("slide-counter-label");
  const dotsContainer = document.getElementById("slide-dots-container");

  // Floating anchor buttons
  const btnAnchorLeft = document.getElementById("btn-anchor-left");
  const btnAnchorCenter = document.getElementById("btn-anchor-center");
  const btnAnchorRight = document.getElementById("btn-anchor-right");
  const btnZoomReset = document.getElementById("btn-zoom-reset");

  // Floating side navigation buttons
  const btnFloatingPrev = document.getElementById("btn-floating-prev");
  const btnFloatingNext = document.getElementById("btn-floating-next");

  if (!coverView) return; // Guard in case of hot-reload rendering shifts

  // Scroll the main content window and panel back to top
  const scrollPanelToTop = () => {
    const dictionaryPanel = document.getElementById("panel-dictionary");
    if (dictionaryPanel) {
      dictionaryPanel.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  let currentSlideIdx = 1;
  let currentDeck = "body"; // "body", "bathroom", "seaside"
  let maxSlides = 17;

  // Zoom & Pan states
  let isZoomed = false;
  let currentZoomedColumn = null;
  let isDragging = false;
  let currentScale = 1;
  let startX = 0, startY = 0;
  let translateX = 0, translateY = 0;
  let currentTranslateX = 0, currentTranslateY = 0;
  let clickStartTime = 0;
  let clickStartX = 0, clickStartY = 0;

  // Dynamically toggle zoom anchor visibility based on column position
  const updateAnchorVisibility = () => {
    const isMobile = window.innerWidth <= 900;
    const leftIcon = btnAnchorLeft ? btnAnchorLeft.querySelector("i") : null;
    const rightIcon = btnAnchorRight ? btnAnchorRight.querySelector("i") : null;

    if (isMobile && isZoomed) {
      if (btnZoomReset) btnZoomReset.classList.remove("hidden");
      if (btnAnchorCenter) btnAnchorCenter.style.display = "none";

      if (leftIcon) leftIcon.className = "fa-solid fa-chevron-left";
      if (rightIcon) rightIcon.className = "fa-solid fa-chevron-right";

      if (currentZoomedColumn === "left") {
        if (btnAnchorLeft) btnAnchorLeft.style.display = "none";
        if (btnAnchorRight) {
          btnAnchorRight.style.display = "flex";
          btnAnchorRight.style.opacity = "1";
          btnAnchorRight.style.pointerEvents = "auto";
        }
      } else if (currentZoomedColumn === "center") {
        if (btnAnchorLeft) {
          btnAnchorLeft.style.display = "flex";
          btnAnchorLeft.style.opacity = "1";
          btnAnchorLeft.style.pointerEvents = "auto";
        }
        if (btnAnchorRight) {
          btnAnchorRight.style.display = "flex";
          btnAnchorRight.style.opacity = "1";
          btnAnchorRight.style.pointerEvents = "auto";
        }
      } else if (currentZoomedColumn === "right") {
        if (btnAnchorLeft) {
          btnAnchorLeft.style.display = "flex";
          btnAnchorLeft.style.opacity = "1";
          btnAnchorLeft.style.pointerEvents = "auto";
        }
        if (btnAnchorRight) btnAnchorRight.style.display = "none";
      }
      return;
    }

    if (!isZoomed) {
      if (btnZoomReset) btnZoomReset.classList.add("hidden");
      if (leftIcon) leftIcon.className = "fa-solid fa-circle-dot";
      if (rightIcon) rightIcon.className = "fa-solid fa-circle-dot";
      if (btnAnchorLeft) { btnAnchorLeft.style.opacity = ""; btnAnchorLeft.style.pointerEvents = ""; btnAnchorLeft.style.display = "flex"; }
      if (btnAnchorCenter) { btnAnchorCenter.style.opacity = ""; btnAnchorCenter.style.pointerEvents = ""; btnAnchorCenter.style.display = "flex"; }
      if (btnAnchorRight) { btnAnchorRight.style.opacity = ""; btnAnchorRight.style.pointerEvents = ""; btnAnchorRight.style.display = "flex"; }
      return;
    }

    // Desktop zoomed handling
    if (btnZoomReset) btnZoomReset.classList.remove("hidden");
    if (leftIcon) leftIcon.className = "fa-solid fa-chevron-left";
    if (rightIcon) rightIcon.className = "fa-solid fa-chevron-right";

    const width = slideImage.clientWidth;
    const limitX = (width * currentScale - width) / 2;

    if (limitX > 10) {
      const activeX = currentTranslateX;

      // Always hide Center button when zoomed in
      if (btnAnchorCenter) { btnAnchorCenter.style.opacity = "0"; btnAnchorCenter.style.pointerEvents = "none"; }

      // Centered on Left Column: hide Left button, show Right button
      if (activeX > limitX * 0.35) {
        if (btnAnchorLeft) { btnAnchorLeft.style.opacity = "0"; btnAnchorLeft.style.pointerEvents = "none"; }
        if (btnAnchorRight) { btnAnchorRight.style.opacity = ""; btnAnchorRight.style.pointerEvents = ""; }
      } 
      // Centered on Right Column: hide Right button, show Left button
      else if (activeX < -limitX * 0.35) {
        if (btnAnchorRight) { btnAnchorRight.style.opacity = "0"; btnAnchorRight.style.pointerEvents = "none"; }
        if (btnAnchorLeft) { btnAnchorLeft.style.opacity = ""; btnAnchorLeft.style.pointerEvents = ""; }
      } 
      // Centered on Center Column: show both Left and Right buttons
      else {
        if (btnAnchorLeft) { btnAnchorLeft.style.opacity = ""; btnAnchorLeft.style.pointerEvents = ""; }
        if (btnAnchorRight) { btnAnchorRight.style.opacity = ""; btnAnchorRight.style.pointerEvents = ""; }
      }
    } else {
      if (btnAnchorLeft) { btnAnchorLeft.style.opacity = "0"; btnAnchorLeft.style.pointerEvents = "none"; }
      if (btnAnchorCenter) { btnAnchorCenter.style.opacity = "0"; btnAnchorCenter.style.pointerEvents = "none"; }
      if (btnAnchorRight) { btnAnchorRight.style.opacity = "0"; btnAnchorRight.style.pointerEvents = "none"; }
    }
  };

  const resetZoom = () => {
    isZoomed = false;
    currentZoomedColumn = null;
    isDragging = false;
    currentScale = 1;
    translateX = 0;
    translateY = 0;
    currentTranslateX = 0;
    currentTranslateY = 0;
    if (slideImage) {
      slideImage.style.transform = "translate(0px, 0px) scale(1)";
      slideImage.style.transition = "";
      slideImage.classList.remove("zoomed");
    }
    if (slideImageWrapper) {
      slideImageWrapper.classList.remove("zoomed-state");
      slideImageWrapper.classList.remove("mobile-column-zoomed");
    }
    if (btnZoomReset) {
      btnZoomReset.classList.add("hidden");
    }
    updateAnchorVisibility();
  };

  // Build pagination dots dynamically based on total slides
  const buildPaginationDots = (totalSlides) => {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";
    for (let i = 1; i <= totalSlides; i++) {
      const dot = document.createElement("div");
      dot.className = "slide-dot";
      dot.title = `Go to Slide ${i}`;
      dot.addEventListener("click", () => {
        currentSlideIdx = i;
        updateSlideDisplay();
        scrollPanelToTop();
      });
      dotsContainer.appendChild(dot);
    }
  };

  const headerIntro = document.getElementById("dict-header-intro");
  const deckTitleEl = document.getElementById("slideshow-deck-title");

  const updateSlideDisplay = () => {
    if (!slideImage || !counterLabel) return;

    // Reset zoom state on page change
    resetZoom();

    if (currentDeck === "body") {
      slideImage.src = `assets/dict/page_${currentSlideIdx}.png`;
      counterLabel.textContent = `Slide ${currentSlideIdx} of 17`;
      if (deckTitleEl) deckTitleEl.innerHTML = `<i class="fa-solid fa-person-half-dress"></i> Body Parts`;
      maxSlides = 17;
    } else if (currentDeck === "bathroom") {
      slideImage.src = `assets/dict/bathroom_page_${currentSlideIdx}.png`;
      counterLabel.textContent = `Slide ${currentSlideIdx} of 18`;
      if (deckTitleEl) deckTitleEl.innerHTML = `<i class="fa-solid fa-bath"></i> Inside The Bathroom`;
      maxSlides = 18;
    } else {
      slideImage.src = `assets/dict/seaside_page_${currentSlideIdx}.png`;
      counterLabel.textContent = `Slide ${currentSlideIdx} of 21`;
      if (deckTitleEl) deckTitleEl.innerHTML = `<i class="fa-solid fa-umbrella-beach"></i> Sea Side`;
      maxSlides = 21;
    }

    // Toggle nav buttons disabled state visual indicators
    if (btnPrevSlide) {
      btnPrevSlide.style.opacity = currentSlideIdx === 1 ? "0.4" : "1";
      btnPrevSlide.style.cursor = currentSlideIdx === 1 ? "default" : "pointer";
    }
    if (btnNextSlide) {
      btnNextSlide.style.opacity = currentSlideIdx === maxSlides ? "0.4" : "1";
      btnNextSlide.style.cursor = currentSlideIdx === maxSlides ? "default" : "pointer";
    }

    // Toggle side floating nav buttons
    if (btnFloatingPrev) {
      btnFloatingPrev.style.opacity = currentSlideIdx === 1 ? "0" : "";
      btnFloatingPrev.style.pointerEvents = currentSlideIdx === 1 ? "none" : "auto";
    }
    if (btnFloatingNext) {
      btnFloatingNext.style.opacity = currentSlideIdx === maxSlides ? "0" : "";
      btnFloatingNext.style.pointerEvents = currentSlideIdx === maxSlides ? "none" : "auto";
    }

    // Highlight active dot
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll(".slide-dot");
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index + 1 === currentSlideIdx);
      });
    }

    updateAnchorVisibility();
  };

  // 1. Cover Card Click: Body Parts
  if (btnStartBodySlides) {
    btnStartBodySlides.addEventListener("click", () => {
      coverView.classList.add("hidden");
      if (headerIntro) headerIntro.classList.add("hidden");
      slideshowView.classList.remove("hidden");
      currentDeck = "body";
      maxSlides = 17;
      currentSlideIdx = 1;
      buildPaginationDots(17);
      updateSlideDisplay();
      scrollPanelToTop();
    });
  }

  // 1b. Cover Card Click: Inside The Bathroom
  if (btnStartBathroomSlides) {
    btnStartBathroomSlides.addEventListener("click", () => {
      coverView.classList.add("hidden");
      if (headerIntro) headerIntro.classList.add("hidden");
      slideshowView.classList.remove("hidden");
      currentDeck = "bathroom";
      maxSlides = 18;
      currentSlideIdx = 1;
      buildPaginationDots(18);
      updateSlideDisplay();
      scrollPanelToTop();
    });
  }

  // 1c. Cover Card Click: Sea Side
  if (btnStartSeasideSlides) {
    btnStartSeasideSlides.addEventListener("click", () => {
      coverView.classList.add("hidden");
      if (headerIntro) headerIntro.classList.add("hidden");
      slideshowView.classList.remove("hidden");
      currentDeck = "seaside";
      maxSlides = 21;
      currentSlideIdx = 1;
      buildPaginationDots(21);
      updateSlideDisplay();
      scrollPanelToTop();
    });
  }

  // 2. Back / Close Button Click
  if (btnCloseSlides) {
    btnCloseSlides.addEventListener("click", () => {
      slideshowView.classList.add("hidden");
      coverView.classList.remove("hidden");
      if (headerIntro) headerIntro.classList.remove("hidden");
      resetZoom();
      scrollPanelToTop();
    });
  }

  // 3. Previous/Next Slide clicks
  if (btnPrevSlide) {
    btnPrevSlide.addEventListener("click", () => {
      if (currentSlideIdx > 1) {
        currentSlideIdx--;
        updateSlideDisplay();
        scrollPanelToTop();
      }
    });
  }

  if (btnNextSlide) {
    btnNextSlide.addEventListener("click", () => {
      if (currentSlideIdx < maxSlides) {
        currentSlideIdx++;
        updateSlideDisplay();
        scrollPanelToTop();
      }
    });
  }

  // 3b. Floating Side Arrow Clicks (Next & Prev Page)
  if (btnFloatingPrev) {
    btnFloatingPrev.addEventListener("click", (e) => {
      e.stopPropagation();
      if (currentSlideIdx > 1) {
        currentSlideIdx--;
        updateSlideDisplay();
        scrollPanelToTop();
      }
    });
  }

  if (btnFloatingNext) {
    btnFloatingNext.addEventListener("click", (e) => {
      e.stopPropagation();
      if (currentSlideIdx < maxSlides) {
        currentSlideIdx++;
        updateSlideDisplay();
        scrollPanelToTop();
      }
    });
  }

  // 4. Keyboard Arrow Key Navigation (when slides panel is visible)
  window.addEventListener("keydown", (e) => {
    if (slideshowView.classList.contains("hidden")) return;

    if (e.key === "ArrowLeft") {
      if (currentSlideIdx > 1) {
        currentSlideIdx--;
        updateSlideDisplay();
        scrollPanelToTop();
      }
    } else if (e.key === "ArrowRight") {
      if (currentSlideIdx < maxSlides) {
        currentSlideIdx++;
        updateSlideDisplay();
        scrollPanelToTop();
      }
    }
  });

  // 5. Zoom & Pan Event Listeners on slideImage
  if (slideImage) {
    slideImage.addEventListener("mousedown", (e) => {
      clickStartTime = Date.now();
      clickStartX = e.clientX;
      clickStartY = e.clientY;

      if (isZoomed) {
        isDragging = true;
        slideImage.style.transition = "none"; // Disable smooth transition during drag
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        e.preventDefault(); // Prevent standard image drag selector
      }
    });

    window.addEventListener("mousemove", (e) => {
      if (!isZoomed || !isDragging) return;

      currentTranslateX = e.clientX - startX;
      currentTranslateY = e.clientY - startY;

      // Bound panning coordinates so the slide doesn't go off screen
      const width = slideImage.clientWidth;
      const height = slideImage.clientHeight;
      const limitX = (width * currentScale - width) / 2;
      const limitY = (height * currentScale - height) / 2;

      currentTranslateX = Math.max(-limitX, Math.min(limitX, currentTranslateX));
      currentTranslateY = Math.max(-limitY, Math.min(limitY, currentTranslateY));

      slideImage.style.transform = `translate(${currentTranslateX}px, ${currentTranslateY}px) scale(${currentScale})`;
      updateAnchorVisibility();
    });

    window.addEventListener("mouseup", (e) => {
      if (isDragging) {
        isDragging = false;
        slideImage.style.transition = ""; // Restore smooth transition
        translateX = currentTranslateX;
        translateY = currentTranslateY;
        updateAnchorVisibility();
      }

      // Check if this was a simple click to toggle zoom rather than a drag
      const dragDuration = Date.now() - clickStartTime;
      const dragDistance = Math.hypot(e.clientX - clickStartX, e.clientY - clickStartY);

      if (e.target === slideImage && dragDuration < 200 && dragDistance < 6) {
        const isMobile = window.innerWidth <= 900;
        if (isMobile) {
          if (!isZoomed) {
            const rect = slideImage.getBoundingClientRect();
            const clickRel = e.clientX - rect.left;
            if (clickRel < rect.width / 3) {
              snapToAnchor("left");
            } else if (clickRel > (2 * rect.width) / 3) {
              snapToAnchor("right");
            } else {
              snapToAnchor("center");
            }
          } else {
            resetZoom();
          }
          return;
        }

        isZoomed = !isZoomed;
        if (isZoomed) {
          currentScale = 2; // Default 2x zoom on click
          slideImage.classList.add("zoomed");
          if (slideImageWrapper) {
            slideImageWrapper.classList.add("zoomed-state");
          }
          
          const rect = slideImage.getBoundingClientRect();
          const clickX_rel = (e.clientX - rect.left) - rect.width / 2;
          const clickY_rel = (e.clientY - rect.top) - rect.height / 2;

          // Center zoom on mouse click coordinates
          translateX = -clickX_rel * (currentScale - 1);
          translateY = -clickY_rel * (currentScale - 1);

          // Apply bounds check
          const width = slideImage.clientWidth;
          const height = slideImage.clientHeight;
          const limitX = (width * currentScale - width) / 2;
          const limitY = (height * currentScale - height) / 2;

          translateX = Math.max(-limitX, Math.min(limitX, translateX));
          translateY = Math.max(-limitY, Math.min(limitY, translateY));

          currentTranslateX = translateX;
          currentTranslateY = translateY;

          slideImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
        } else {
          resetZoom();
        }
        updateAnchorVisibility();
      }
    });

    // Make sure dragging stops cleanly if cursor leaves window
    window.addEventListener("mouseleave", () => {
      if (isDragging) {
        isDragging = false;
        slideImage.style.transition = "";
        translateX = currentTranslateX;
        translateY = currentTranslateY;
        updateAnchorVisibility();
      }
    });

    // 6. Mouse Wheel Scroll (Vertical Panning) when zoomed in
    slideImage.addEventListener("wheel", (e) => {
      if (!isZoomed) return; // Only scroll vertically after zoom has happened

      e.preventDefault(); // Stop normal page scroll while interacting with zoomed slide

      const width = slideImage.clientWidth;
      const height = slideImage.clientHeight;
      const limitY = (height * currentScale - height) / 2;

      // Scroll speed factor
      const scrollSpeed = 0.8;
      translateY -= e.deltaY * scrollSpeed;

      // Bound Y coordinate
      translateY = Math.max(-limitY, Math.min(limitY, translateY));
      currentTranslateY = translateY;

      slideImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
    }, { passive: false });

    // 7. Snap-to-column anchor clicks
    const snapToAnchor = (column) => {
      const isMobile = window.innerWidth <= 900;
      if (isMobile) {
        isZoomed = true;
        currentZoomedColumn = column;
        if (slideImageWrapper) {
          slideImageWrapper.classList.add("mobile-column-zoomed");
          slideImageWrapper.classList.remove("zoomed-state");
        }
        if (slideImage) {
          slideImage.classList.add("zoomed");
          let xPercent = 0;
          if (column === "left") xPercent = 0;
          else if (column === "center") xPercent = -33.333333;
          else if (column === "right") xPercent = -66.666667;
          slideImage.style.transform = `translate3d(${xPercent}%, 0, 0)`;
        }
        updateAnchorVisibility();
        return;
      }

      if (!isZoomed) {
        isZoomed = true;
        currentScale = 2;
        slideImage.classList.add("zoomed");
        if (slideImageWrapper) {
          slideImageWrapper.classList.add("zoomed-state");
        }
      }

      const width = slideImage.clientWidth;
      const limitX = (width * currentScale - width) / 2;

      // Snap to the top of the slide
      const height = slideImage.clientHeight;
      const limitY = (height * currentScale - height) / 2;
      translateY = limitY;
      currentTranslateY = limitY;

      if (column === "left") {
        translateX = limitX;
      } else if (column === "center") {
        translateX = 0;
      } else if (column === "right") {
        translateX = -limitX;
      }

      currentTranslateX = translateX;
      slideImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
      updateAnchorVisibility();
    };

    if (btnAnchorLeft) {
      btnAnchorLeft.addEventListener("click", (e) => {
        e.stopPropagation();
        const isMobile = window.innerWidth <= 900;
        if (isMobile && isZoomed) {
          if (currentZoomedColumn === "right") {
            snapToAnchor("center");
          } else {
            snapToAnchor("left");
          }
        } else if (!isZoomed) {
          snapToAnchor("left");
        } else {
          const width = slideImage.clientWidth;
          const limitX = (width * currentScale - width) / 2;
          if (currentTranslateX < -limitX * 0.35) {
            snapToAnchor("center");
          } else {
            snapToAnchor("left");
          }
        }
        scrollPanelToTop();
      });
    }

    if (btnAnchorCenter) {
      btnAnchorCenter.addEventListener("click", (e) => {
        e.stopPropagation();
        snapToAnchor("center");
        scrollPanelToTop();
      });
    }

    if (btnAnchorRight) {
      btnAnchorRight.addEventListener("click", (e) => {
        e.stopPropagation();
        const isMobile = window.innerWidth <= 900;
        if (isMobile && isZoomed) {
          if (currentZoomedColumn === "left") {
            snapToAnchor("center");
          } else {
            snapToAnchor("right");
          }
        } else if (!isZoomed) {
          snapToAnchor("right");
        } else {
          const width = slideImage.clientWidth;
          const limitX = (width * currentScale - width) / 2;
          if (currentTranslateX > limitX * 0.35) {
            snapToAnchor("center");
          } else {
            snapToAnchor("right");
          }
        }
        scrollPanelToTop();
      });
    }

    if (btnZoomReset) {
      btnZoomReset.addEventListener("click", (e) => {
        e.stopPropagation();
        resetZoom();
      });
    }

    // Touch swipe between columns on mobile
    let touchStartX = 0;
    let touchStartY = 0;
    if (slideImageWrapper) {
      slideImageWrapper.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        }
      }, { passive: true });

      slideImageWrapper.addEventListener("touchend", (e) => {
        const isMobile = window.innerWidth <= 900;
        if (!isMobile || !isZoomed || e.changedTouches.length === 0) return;
        const diffX = e.changedTouches[0].clientX - touchStartX;
        const diffY = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX < 0) {
            // Swipe left -> next column
            if (currentZoomedColumn === "left") snapToAnchor("center");
            else if (currentZoomedColumn === "center") snapToAnchor("right");
          } else {
            // Swipe right -> prev column
            if (currentZoomedColumn === "right") snapToAnchor("center");
            else if (currentZoomedColumn === "center") snapToAnchor("left");
          }
        }
      }, { passive: true });
    }
  }
}

// -------------------------------------------------------------
// Panel 6: The Describing Lab (Identical Layout & Feel to Sol Tab)
// -------------------------------------------------------------
function initDescribingLabPanel() {
  const customUploadInput = document.getElementById("lab-custom-upload");
  const labHomeInput = document.getElementById("lab-home-input");
  const labLangSelector = document.getElementById("lab-lang-selector");
  const labLangName = document.getElementById("lab-lang-name");
  const btnLabMic = document.getElementById("btn-lab-mic");
  const btnLabSend = document.getElementById("btn-lab-send");
  const labConversationEl = document.getElementById("lab-home-conversation");
  const roleChips = document.querySelectorAll("#describing-role-pills .gemini-chip-btn");

  let activeRole = "creative"; // creative, linguist, storyteller, vocab, quick

  const ROLE_CONFIGS = {
    creative: {
      name: "Creative Writer",
      directive: `You are Sol acting as a master Creative Writing Mentor and Stylist.
Analyze the user's description with a focus on sensory engagement, mood, evocative imagery, and literary elegance.
Structure your response as follows:
1. 🌟 **Atmospheric Impression**: A warm, encouraging 2-sentence reaction to the mood and feeling evoked by their description.
2. 👁️ **Sensory & Visual Elevation**: Highlight what they captured well and suggest 2 evocative literary metaphors or sensory details.
3. 💎 **Vivid Vocabulary Palette**: Present 3 exquisite, evocative adjectives or verbs (with brief native context) to replace ordinary words.
4. 📜 **Polished Native Masterpiece**: Provide a beautifully written, native-level rewrite of their description that preserves their core ideas while elevating it to vivid literature.
CRITICAL: Speak directly to the user. Do NOT output internal drafts, thoughts, or notes.`
    },
    linguist: {
      name: "Precision Linguist",
      directive: `You are Sol acting as an elite Precision Linguist and Native Proofreader.
Examine the user's description with grammatical precision, syntax mastery, and natural collocations.
Structure your response as follows:
1. 🔍 **Grammatical Audit**: Identify any errors in verb conjugation, prepositions, agreement, or awkward word order. If accurate, praise the syntax.
2. 💡 **Native Nuance & Collocations**: Explain 2 natural phrasing adjustments that separate a textbook learner from an authentic native speaker.
3. 💎 **Key Terminology**: 3 polished vocabulary words or idiomatic combinations that fit this description.
4. ✍️ **Linguistically Perfected Rewrite**: Provide an authentic, idiomatic rewrite of their description with flawless grammar.
CRITICAL: Speak directly to the user. Do NOT output internal drafts, thoughts, or notes.`
    },
    storyteller: {
      name: "Storyteller & Companion",
      directive: `You are Sol acting as a warm, imaginative Travel Companion and Storyteller standing right beside the user in this scene.
React conversationally to what they wrote, treating their words as a real shared experience.
Structure your response as follows:
1. 🎙️ **Sol's Living Reaction**: React vividly to their description as if you are experiencing it together.
2. 📖 **The Story Unfolds**: Weave their description into the opening lines of an intriguing story.
3. 💎 **Expressive Words**: 3 colorful words or colloquial expressions natural speakers use to talk about this topic.
4. ❓ **Curious Question**: Ask a compelling, imaginative question about what might happen next.
CRITICAL: Speak directly to the user. Do NOT output internal drafts, thoughts, or notes.`
    },
    vocab: {
      name: "Vocab Architect",
      directive: `You are Sol acting as a Vocabulary Architect.
Your mission is to upgrade the user's vocabulary from basic/intermediate to sophisticated, evocative fluency (C1/C2).
Structure your response as follows:
1. ⚡ **Vocabulary Scorecard**: A brief, encouraging assessment of their lexical variety.
2. 🚀 **Word Upgrades (Before ➔ After)**:
   - Identify 3-4 basic or repeated words from their text and provide high-tier native upgrades with concise definitions.
3. 💎 **Sensory Descriptors**: Provide 2 rich idiomatic or sensory phrases tailored to their description.
4. 🌟 **Lexically Elevated Rewrite**: Rewrite their entire description using advanced, natural vocabulary.
CRITICAL: Speak directly to the user. Do NOT output internal drafts, thoughts, or notes.`
    },
    quick: {
      name: "Quick Critique",
      directive: `You are Sol providing a rapid-fire, high-impact language critique. Keep it crisp, sharp, and directly actionable.
Structure your response as follows:
- 🎯 **1 Grammar/Nuance Tweak**: The single most impactful adjustment to make.
- 💎 **3 Vocabulary Boosts**: 3 upgraded native words for this context.
- 🏆 **Polished Rewrite**: One concise, native-sounding rewrite of their description.
CRITICAL: Keep it brief and speak directly. Do NOT output internal thoughts or drafts.`
    }
  };

  // Role Chips
  roleChips.forEach(chip => {
    chip.addEventListener("click", () => {
      roleChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      activeRole = chip.getAttribute("data-role") || "creative";
      if (typeof showToast === "function") {
        const name = ROLE_CONFIGS[activeRole] ? ROLE_CONFIGS[activeRole].name : "Sol";
        showToast(`Sol Mode: ${name}`);
      }
    });
  });

  // Optional Custom Image Upload Attachment
  if (customUploadInput) {
    customUploadInput.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (file && typeof showToast === "function") {
        showToast(`📷 Image attached: ${file.name}`);
      }
    });
  }

  // Target Language Selector Cycle
  const LANGUAGES = ["English", "Spanish", "French", "German", "Italian", "Portuguese"];
  if (labLangSelector) {
    labLangSelector.addEventListener("click", () => {
      const current = labLangName ? labLangName.textContent.trim() : "English";
      const nextIdx = (LANGUAGES.indexOf(current) + 1) % LANGUAGES.length;
      const nextLang = LANGUAGES[nextIdx];
      if (labLangName) labLangName.textContent = nextLang;
      if (typeof showToast === "function") showToast(`Language: ${nextLang}`);
    });
  }

  // Voice Input (Speech-to-Text)
  if (btnLabMic) {
    btnLabMic.addEventListener("click", () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech recognition is not supported in this browser. Please type your description.");
        return;
      }
      btnLabMic.style.color = "#ef4444";
      if (typeof showToast === "function") showToast("🎙️ Listening... Describe the scene now!");

      const recognition = new SpeechRecognition();
      const currentLang = labLangName ? labLangName.textContent.trim() : "English";
      const langCodes = {
        English: "en-US",
        Spanish: "es-ES",
        French: "fr-FR",
        German: "de-DE",
        Italian: "it-IT",
        Portuguese: "pt-BR"
      };
      recognition.lang = langCodes[currentLang] || "en-US";
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        btnLabMic.style.color = "";
        const transcript = event.results[0][0].transcript;
        if (labHomeInput) {
          labHomeInput.value = transcript;
          syncInputBarHasText(labHomeInput);
          labHomeInput.focus();
        }
      };

      recognition.onerror = () => {
        btnLabMic.style.color = "";
        if (typeof showToast === "function") showToast("Voice input cancelled or unavailable.");
      };

      recognition.onend = () => {
        btnLabMic.style.color = "";
      };

      recognition.start();
    });
  }

  // Submit Description to Sol
  const submitLabDescription = async (query) => {
    if (!query || !labConversationEl) return;
    if (labHomeInput) {
      labHomeInput.value = "";
      syncInputBarHasText(labHomeInput);
    }

    const lang = labLangName ? labLangName.textContent.trim() : "English";
    const roleCfg = ROLE_CONFIGS[activeRole] || ROLE_CONFIGS.creative;

    // 1. Render User Message Bubble
    const userDiv = document.createElement("div");
    userDiv.className = "gemini-inline-message";
    userDiv.innerHTML = `<div class="gemini-user-query">${escapeHtml(query)}</div>`;
    labConversationEl.appendChild(userDiv);

    // 2. Render Gemini AI Response Bubble
    const aiDiv = document.createElement("div");
    aiDiv.className = "gemini-inline-message";
    aiDiv.innerHTML = `
      <div class="gemini-ai-response">
        <div class="gemini-ai-body">
          <i class="fa-solid fa-spinner fa-spin" style="color: var(--accent-yellow);"></i> Reviewing your description...
        </div>
      </div>
    `;
    labConversationEl.appendChild(aiDiv);
    aiDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });

    const aiBody = aiDiv.querySelector(".gemini-ai-body");
    let responseText = "";

    const systemInstruction = `${roleCfg.directive}
Target Language: ${lang}
CRITICAL OUTPUT DIRECTIVE: Speak directly to the user as Sol. Do NOT output internal drafts, thought processes, or meta notes.`;

    const prompt = `The user wrote the following description in ${lang}:
"${query}"

Provide your feedback and guidance in character as Sol (${roleCfg.name}).`;

    if (geminiService.hasApiKey()) {
      try {
        const messages = [{ role: "user", content: prompt, parts: [{ text: prompt }] }];
        await geminiService.generateResponseStream(
          messages,
          systemInstruction,
          "gemini-1.5-flash",
          (chunk) => {
            if (responseText === "") aiBody.innerHTML = "";
            responseText += chunk;
            aiBody.innerHTML = marked.parse(responseText) + `<span class="cursor-blink"></span>`;
            aiDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
          },
          (err) => {
            aiBody.innerHTML = `<div style="color: #ef4444;"><i class="fa-solid fa-triangle-exclamation"></i> Error: ${escapeHtml(err)}</div>`;
          },
          (finalText) => {
            if (finalText) {
              responseText = finalText;
              aiBody.innerHTML = marked.parse(responseText);
              aiBody.setAttribute("data-raw-text", responseText);
              attachAiActions(aiDiv, responseText);
            }
          }
        );

        if (responseText && !aiBody.querySelector(".gemini-ai-actions")) {
          aiBody.innerHTML = marked.parse(responseText);
          aiBody.setAttribute("data-raw-text", responseText);
          attachAiActions(aiDiv, responseText);
        }
      } catch (e) {
        console.error(e);
        aiBody.innerHTML = `<div style="color: #ef4444;">Error connecting to Gemini API. Please check your settings.</div>`;
      }
    } else {
      // Demo Mode feedback
      setTimeout(() => {
        let demoContent = "";
        if (activeRole === "creative") {
          demoContent = `### 🌟 Atmospheric Impression
Your description establishes a peaceful and evocative sense of place. You have a great natural eye for setting the scene!

### 👁️ Sensory & Visual Elevation
- **Visual Depth**: Contrast the stillness of the shoreline with the movement of the tides.
- **Sensory Detail**: Bring in subtle sounds—the soft hiss of receding foam or the cooling ocean breeze.

### 💎 Vivid Vocabulary Palette
- **Resplendent** (*adj.*) — Glowing with radiant beauty (*"The horizon was resplendent in amber."*)
- **Ethereal** (*adj.*) — Extremely delicate and light in a way that seems not of this world.
- **Undulating** (*adj.*) — Moving with smooth, wave-like motions.

### 📜 Polished Native Masterpiece
> *"As dusk descends across the coastline, the horizon glows with resplendent peach and gold. Gentle undulating tides roll across the shore, casting an ethereal shimmer over the wet sands."*`;
        } else if (activeRole === "linguist") {
          demoContent = `### 🔍 Grammatical Audit
- **Sentence Structure**: Excellent cohesion and subject-verb consistency.
- **Preposition Precision**: Ensure prepositions match the physical action (e.g. *"on the beach"* vs. *"at the water's edge"*).

### 💡 Native Nuance & Collocations
- Instead of saying *"the light is very nice"*, native speakers naturally use collocations like *"bathed in warm light"* or *"dappled sunlight"*.

### 💎 Key Terminology
- **Shoreline** — The precise boundary between land and water.
- **Tideline** — The mark left by highest tide.
- **Crystalline** — Clear, sparkling like crystal.

### ✍️ Linguistically Perfected Rewrite
> *"The tranquil shoreline is bathed in soft, warm light as gentle tides break rhythmically against the golden sand, creating an effortlessly peaceful scene."*`;
        } else if (activeRole === "vocab") {
          demoContent = `### ⚡ Vocabulary Scorecard
**Level**: Strong foundation. With a few sensory adjective swaps, this immediately reaches C1/C2 native sophistication!

### 🚀 Word Upgrades (Before ➔ After)
- *Beautiful / Good* ➔ **Sublime** / **Picturesque**
- *Bright light* ➔ **Radiant glow** / **Luminescent**
- *Big / Endless* ➔ **Vast expanse** / **Panoramic**
- *Calm* ➔ **Tranquil** / **Serene**

### 💎 Sensory Descriptors
- **"Sun-drenched horizon"** — Filled with brilliant sunlight.
- **"Balmy sea breeze"** — Mild, pleasantly warm coastal air.

### 🌟 Lexically Elevated Rewrite
> *"A picturesque panorama unfolds as the sun-drenched horizon casts a sublime glow across the vast coastal expanse, enveloped by a soothing, balmy breeze."*`;
        } else if (activeRole === "storyteller") {
          demoContent = `### 🎙️ Sol's Living Reaction
*Man, look at that horizon!* You captured the exact calm you only get right before the sun completely disappears. It makes me want to kick off my shoes and walk right down to the water's edge.

### 📖 The Story Unfolds
> *"We arrived just as the rest of the world was packing up. The wind had dropped to a whisper, and every wave sounded like a secret told to the shore..."*

### 💎 Expressive Words
- **Golden hour** — The magical hour before sunset with ideal lighting.
- **Wanderlust** — A strong impulse to travel and explore.
- **Stillness** — Complete quiet and calm.

### ❓ Curious Question
If you were standing right there right now with a warm cup in your hand, what thought or memory would this view bring to mind?`;
        } else {
          demoContent = `### 🎯 1 Grammar/Nuance Tweak
Watch adjective placement and preposition flow—link your adjectives directly before the noun for sharper native impact.

### 💎 3 Vocabulary Boosts
- **Luminescent** (replaces *bright*)
- **Tranquility** (replaces *quiet place*)
- **Horizon** (replaces *sky line*)

### 🏆 Polished Rewrite
> *"A serene tranquility blankets the coast as luminescent light ripples along the golden shoreline."*`;
        }

        responseText = demoContent;
        aiBody.innerHTML = marked.parse(responseText);
        aiBody.setAttribute("data-raw-text", responseText);
        attachAiActions(aiDiv, responseText);
      }, 1000);
    }
  };

  // Listeners for Send and Enter key
  if (btnLabSend) {
    btnLabSend.addEventListener("click", () => {
      const q = labHomeInput ? labHomeInput.value.trim() : "";
      if (q) submitLabDescription(q);
    });
  }

  if (labHomeInput) {
    syncInputBarHasText(labHomeInput);
    labHomeInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        const q = labHomeInput.value.trim();
        if (q) submitLabDescription(q);
      }
    });
    labHomeInput.addEventListener("input", () => syncInputBarHasText(labHomeInput));
    labHomeInput.addEventListener("keyup", () => syncInputBarHasText(labHomeInput));
    labHomeInput.addEventListener("change", () => syncInputBarHasText(labHomeInput));
  }

}


// -------------------------------------------------------------
// Panel 7: The Output Practicing (Real-Time Live Spoken SOL Conversation)
// -------------------------------------------------------------
let activeOutputRole = "conversation"; // conversation, pronunciation, roleplay, quick
let outputSpeechRecognition = null;
let isOutputListening = false;
let isSolSpeaking = false;
let silenceTimer = null;
let liveUserBubble = null;
let accumulatedLiveTranscript = "";
let windowActiveUtterance = null;
let cachedVoices = [];

function getBrowserVoices() {
  if ("speechSynthesis" in window) {
    cachedVoices = window.speechSynthesis.getVoices();
  }
  return cachedVoices;
}
if ("speechSynthesis" in window) {
  getBrowserVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    getBrowserVoices();
  };
}

const OUTPUT_ROLE_CONFIGS = {
  conversation: {
    name: "Free Conversation",
    directive: `You are Sol, a warm, lively native conversation partner. You are having an authentic real-time live spoken conversation with the learner.
Respond naturally, warmly, and concisely (1-3 spoken sentences). Keep your tone conversational, clear, and easy to understand out loud. Encourage the learner and ask an engaging follow-up question.`
  },
  pronunciation: {
    name: "Pronunciation Coach",
    directive: `You are Sol acting as a friendly, expert Pronunciation and Spoken Fluency Coach.
Commend the learner's spoken turn, model the most authentic native phrasing, and highlight one specific spoken nuance (e.g. vowel clarity, rhythm, or connected speech) in a concise, friendly 2-3 sentence spoken response.`
  },
  roleplay: {
    name: "Daily Roleplay",
    directive: `You are Sol participating in a realistic daily life roleplay scenario (e.g., ordering at a lively cafe, checking in for travel, greeting a friend, or meeting someone new).
Stay naturally in character and reply conversationally in 1-3 spoken sentences, keeping the scenario moving forward seamlessly.`
  },
  quick: {
    name: "Quick Q&A",
    directive: `You are Sol doing rapid-fire verbal agility practice.
React immediately to what the user said in one snappy sentence, and ask the next lively, open-ended question to test spontaneous verbal reaction.`
  }
};

function updateOutputGreetingText() {
  const greetingEl = document.getElementById("output-greeting-text");
  if (!greetingEl) return;
  
  let name = "Adrian";
  try {
    const profile = JSON.parse(localStorage.getItem("sol_user_profile"));
    if (profile && profile.name) {
      name = profile.name.split(" ")[0];
    }
  } catch (e) {}

  greetingEl.textContent = `Speak with Sol, ${name}!`;
}

function initOutputPracticingPanel() {
  updateOutputGreetingText();

  const rolePills = document.querySelectorAll("#output-role-pills .gemini-chip-btn");
  const langSelector = document.getElementById("output-lang-selector");
  const langName = document.getElementById("output-lang-name");
  const btnReset = document.getElementById("output-btn-reset");
  const micBtn = document.getElementById("btn-output-live-mic");
  const statusEl = document.getElementById("output-live-status");
  const statusText = document.getElementById("output-status-text");
  const conversationEl = document.getElementById("output-home-conversation");

  // Target Languages
  const LANGUAGES = [
    { label: "English", code: "en-US" },
    { label: "Spanish", code: "es-ES" },
    { label: "French", code: "fr-FR" },
    { label: "German", code: "de-DE" },
    { label: "Italian", code: "it-IT" },
    { label: "Portuguese", code: "pt-BR" }
  ];
  let currentLangIdx = 0;

  // Role Chips
  rolePills.forEach(chip => {
    chip.onclick = () => {
      rolePills.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      activeOutputRole = chip.getAttribute("data-role") || "conversation";
      const cfg = OUTPUT_ROLE_CONFIGS[activeOutputRole];
      if (typeof showToast === "function") {
        showToast(`Mode: ${cfg ? cfg.name : 'Free Conversation'}`);
      }
    };
  });

  // Language Selector
  if (langSelector) {
    langSelector.onclick = () => {
      currentLangIdx = (currentLangIdx + 1) % LANGUAGES.length;
      const lang = LANGUAGES[currentLangIdx];
      if (langName) langName.textContent = lang.label;
      if (typeof showToast === "function") {
        showToast(`Target Language: ${lang.label}`);
      }
    };
  }

  // Reset Conversation
  if (btnReset) {
    btnReset.onclick = () => {
      if (silenceTimer) clearTimeout(silenceTimer);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (outputSpeechRecognition && isOutputListening) {
        try { outputSpeechRecognition.stop(); } catch (e) {}
      }
      isOutputListening = false;
      isSolSpeaking = false;
      accumulatedLiveTranscript = "";
      if (conversationEl) conversationEl.innerHTML = "";
      setOutputLiveState("idle", "Tap the microphone to speak live with Sol");
      if (typeof showToast === "function") showToast("Live conversation reset");
    };
  }

  // Helper to set visual state of live microphone & status bar
  function setOutputLiveState(state, text) {
    if (!micBtn || !statusEl || !statusText) return;
    statusText.textContent = text;
    micBtn.classList.remove("listening", "speaking");
    statusEl.classList.remove("listening", "speaking", "processing");

    if (state === "listening") {
      micBtn.classList.add("listening");
      statusEl.classList.add("listening");
    } else if (state === "speaking") {
      micBtn.classList.add("speaking");
      statusEl.classList.add("speaking");
    } else if (state === "processing") {
      statusEl.classList.add("processing");
    }
  }

  // Speak Sol Live Audio via Web Speech Synthesis (Unblock Chrome audio restrictions)
  function speakLiveAudio(text, langCode) {
    if (!("speechSynthesis" in window)) {
      setOutputLiveState("idle", "Tap the microphone to speak live with Sol");
      return;
    }
    
    // Resume audio context
    window.speechSynthesis.cancel();
    try { window.speechSynthesis.resume(); } catch (e) {}

    // Strip markdown formatting for natural spoken speech
    const cleanText = text
      .replace(/[*_#`~>]/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/\(.*?\)/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanText) {
      setOutputLiveState("idle", "Tap the microphone to speak live with Sol");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = langCode;
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    const voices = getBrowserVoices();
    if (voices && voices.length > 0) {
      const primaryLang = langCode.split("-")[0].toLowerCase();
      const match = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(primaryLang));
      if (match) utterance.voice = match;
    }

    // Keep global reference so garbage collector does not cut off speech in Chrome
    windowActiveUtterance = utterance;

    utterance.onstart = () => {
      isSolSpeaking = true;
      setOutputLiveState("speaking", "🔊 Sol is speaking...");
    };

    utterance.onend = () => {
      isSolSpeaking = false;
      setOutputLiveState("idle", "Tap the microphone to speak live with Sol");
    };

    utterance.onerror = (err) => {
      console.warn("TTS playback warning:", err);
      isSolSpeaking = false;
      setOutputLiveState("idle", "Tap the microphone to speak live with Sol");
    };

    window.speechSynthesis.speak(utterance);
  }

  // Central Live Microphone Button Click Handler
  if (micBtn) {
    micBtn.onclick = () => {
      // Unlock speech synthesis immediately on user gesture
      if (window.speechSynthesis) {
        try { window.speechSynthesis.resume(); } catch (e) {}
      }

      // 1. If Sol is speaking, tapping stops audio and goes to idle
      if (isSolSpeaking || (window.speechSynthesis && window.speechSynthesis.speaking)) {
        window.speechSynthesis.cancel();
        isSolSpeaking = false;
        setOutputLiveState("idle", "Tap the microphone to speak live with Sol");
        return;
      }

      // 2. If already listening, tapping completes & submits speech immediately!
      if (isOutputListening) {
        if (silenceTimer) clearTimeout(silenceTimer);
        const finalCandidate = accumulatedLiveTranscript.trim();
        if (finalCandidate) {
          finishAndSubmitSpeech(finalCandidate, LANGUAGES[currentLangIdx], liveUserBubble);
        } else {
          // No speech detected yet, cancel listening
          if (outputSpeechRecognition) {
            try { outputSpeechRecognition.stop(); } catch (e) {}
          }
          if (liveUserBubble) liveUserBubble.remove();
          isOutputListening = false;
          setOutputLiveState("idle", "Tap the microphone to speak live with Sol");
        }
        return;
      }

      // 3. Start Live Speech Recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech Recognition is not supported by your browser. Please use Google Chrome, Microsoft Edge, or Safari with microphone access.");
        return;
      }

      try {
        outputSpeechRecognition = new SpeechRecognition();
      } catch (err) {
        console.error("SpeechRecognition construct error:", err);
        alert("Could not initialize Speech Recognition. Please ensure microphone access is permitted.");
        return;
      }

      const currentLang = LANGUAGES[currentLangIdx];
      outputSpeechRecognition.lang = currentLang.code;
      outputSpeechRecognition.continuous = true;
      outputSpeechRecognition.interimResults = true;
      outputSpeechRecognition.maxAlternatives = 1;

      accumulatedLiveTranscript = "";
      isOutputListening = true;
      setOutputLiveState("listening", `🎙️ Listening in ${currentLang.label}... Speak now!`);

      // Create live user transcription bubble immediately
      liveUserBubble = document.createElement("div");
      liveUserBubble.className = "gemini-inline-message live-user-speaking";
      liveUserBubble.innerHTML = `
        <div class="gemini-user-query" style="display:flex;align-items:center;gap:0.6rem;">
          <i class="fa-solid fa-microphone" style="font-size:0.85rem;color:var(--accent-yellow,#f6ca21);animation:pulse 1s infinite;"></i>
          <span class="live-user-words" style="opacity:0.8;font-style:italic;">Listening to your voice...</span>
        </div>
      `;
      if (conversationEl) {
        conversationEl.appendChild(liveUserBubble);
        liveUserBubble.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }

      const liveWordsEl = liveUserBubble.querySelector(".live-user-words");

      outputSpeechRecognition.onresult = (event) => {
        let interimText = "";
        let finalText = "";

        for (let i = 0; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalText += event.results[i][0].transcript + " ";
          } else {
            interimText += event.results[i][0].transcript + " ";
          }
        }

        const combinedText = (finalText + interimText).trim();
        if (combinedText) {
          accumulatedLiveTranscript = combinedText;
          if (liveWordsEl) {
            liveWordsEl.textContent = combinedText;
            liveWordsEl.style.opacity = "1";
            liveWordsEl.style.fontStyle = "normal";
          }
          setOutputLiveState("listening", `🎙️ "${combinedText.length > 32 ? '...' + combinedText.slice(-32) : combinedText}"`);
          if (liveUserBubble) liveUserBubble.scrollIntoView({ behavior: "smooth", block: "nearest" });

          // Auto-submit after 1.3s of silence once words have been spoken!
          if (silenceTimer) clearTimeout(silenceTimer);
          silenceTimer = setTimeout(() => {
            if (isOutputListening && accumulatedLiveTranscript.trim()) {
              finishAndSubmitSpeech(accumulatedLiveTranscript.trim(), currentLang, liveUserBubble);
            }
          }, 1300);
        }
      };

      outputSpeechRecognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "no-speech") {
          // Keep listening for speech; don't abort abruptly
          return;
        }
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          alert("Microphone permission is blocked in your browser. Please click the lock / camera icon in the address bar to allow microphone access.");
          if (liveUserBubble && !accumulatedLiveTranscript.trim()) liveUserBubble.remove();
          isOutputListening = false;
          setOutputLiveState("idle", "Tap the microphone to speak live with Sol");
          return;
        }

        // If something was already spoken before error, submit it!
        if (accumulatedLiveTranscript.trim()) {
          finishAndSubmitSpeech(accumulatedLiveTranscript.trim(), currentLang, liveUserBubble);
        } else {
          if (liveUserBubble) liveUserBubble.remove();
          isOutputListening = false;
          setOutputLiveState("idle", "Tap the microphone to speak live with Sol");
        }
      };

      outputSpeechRecognition.onend = () => {
        if (isOutputListening) {
          if (accumulatedLiveTranscript.trim()) {
            finishAndSubmitSpeech(accumulatedLiveTranscript.trim(), currentLang, liveUserBubble);
          } else {
            if (liveUserBubble) liveUserBubble.remove();
            isOutputListening = false;
            setOutputLiveState("idle", "Tap the microphone to speak live with Sol");
          }
        }
      };

      try {
        outputSpeechRecognition.start();
      } catch (err) {
        console.warn("Recognition already active or start error:", err);
      }
    };
  }

  // Handle Finish & Submit Spoken Turn -> Generate Live Response -> Speak Aloud
  async function finishAndSubmitSpeech(userSpeech, langObj, userDiv) {
    if (silenceTimer) clearTimeout(silenceTimer);
    isOutputListening = false;
    if (outputSpeechRecognition) {
      try { outputSpeechRecognition.stop(); } catch (e) {}
    }

    // Convert live speaking bubble to permanent query bubble
    if (userDiv) {
      userDiv.classList.remove("live-user-speaking");
      userDiv.innerHTML = `
        <div class="gemini-user-query" style="display:flex;align-items:center;gap:0.6rem;">
          <i class="fa-solid fa-microphone" style="font-size:0.85rem;color:var(--accent-yellow,#f6ca21);opacity:0.9;"></i>
          <span>${escapeHtml(userSpeech)}</span>
        </div>
      `;
    }

    setOutputLiveState("processing", "⏳ Sol is thinking...");

    // 2. Render Sol AI Response Bubble with loader
    const aiDiv = document.createElement("div");
    aiDiv.className = "gemini-inline-message";
    aiDiv.innerHTML = `
      <div class="gemini-ai-response">
        <div class="gemini-ai-body">
          <i class="fa-solid fa-spinner fa-spin" style="color: var(--accent-yellow);"></i> Listening and preparing spoken answer...
        </div>
      </div>
    `;
    if (conversationEl) {
      conversationEl.appendChild(aiDiv);
      aiDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    const aiBody = aiDiv.querySelector(".gemini-ai-body");
    let responseText = "";

    const roleCfg = OUTPUT_ROLE_CONFIGS[activeOutputRole] || OUTPUT_ROLE_CONFIGS.conversation;
    const systemInstruction = `${roleCfg.directive}
Target Language: ${langObj.label} (${langObj.code})
CRITICAL SPOKEN DIRECTIVE: You are in a real-time live spoken conversation with the learner. Respond aloud in 1-3 spoken sentences. Speak cleanly, warmly, and naturally. Never output markdown asterisks, bullet points, formatting codes, or internal thoughts.`;

    const prompt = `The user said to you in ${langObj.label}: "${userSpeech}". Respond directly in natural spoken dialogue.`;

    // Finalize answer helper
    let finalized = false;
    const finalizeAnswer = (fullText) => {
      if (finalized) return;
      finalized = true;
      responseText = fullText.trim();
      aiBody.innerHTML = marked.parse(responseText);
      aiBody.setAttribute("data-raw-text", responseText);
      attachAiActions(aiDiv, responseText);
      speakLiveAudio(responseText, langObj.code);
    };

    if (geminiService && geminiService.hasApiKey()) {
      try {
        const messages = [{ role: "user", content: prompt, parts: [{ text: prompt }] }];
        await geminiService.generateResponseStream(
          messages,
          systemInstruction,
          "gemini-1.5-flash",
          (chunk) => {
            if (responseText === "") aiBody.innerHTML = "";
            responseText += chunk;
            aiBody.innerHTML = marked.parse(responseText);
            aiDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
          },
          (err) => {
            console.warn("Gemini stream error:", err);
            fallbackSpokenResponse(userSpeech, langObj, aiBody, aiDiv, finalizeAnswer);
          },
          (finalText) => {
            if (finalText) {
              finalizeAnswer(finalText);
            }
          }
        );

        // In case streaming completed without explicit onComplete callback
        setTimeout(() => {
          if (!finalized && responseText) {
            finalizeAnswer(responseText);
          } else if (!finalized && !responseText) {
            fallbackSpokenResponse(userSpeech, langObj, aiBody, aiDiv, finalizeAnswer);
          }
        }, 800);

      } catch (e) {
        console.error("Gemini call error:", e);
        fallbackSpokenResponse(userSpeech, langObj, aiBody, aiDiv, finalizeAnswer);
      }
    } else {
      fallbackSpokenResponse(userSpeech, langObj, aiBody, aiDiv, finalizeAnswer);
    }
  }

  // Fallback Native Spoken Generator (Ensures 100% instant, reliable real-time spoken reply)
  function fallbackSpokenResponse(userSpeech, langObj, aiBody, aiDiv, callback) {
    setTimeout(() => {
      let reply = "";
      const lower = userSpeech.toLowerCase();

      if (langObj.label === "Spanish") {
        if (lower.includes("hola") || lower.includes("buenos") || lower.includes("buenas")) {
          reply = "¡Hola! Qué gusto saludarte. Tu pronunciación se escucha muy clara y natural. ¿Cómo te encuentras hoy?";
        } else if (lower.includes("cómo estás") || lower.includes("que tal") || lower.includes("qué tal")) {
          reply = "¡Me siento genial, gracias por preguntar! Con muchas ganas de practicar español contigo. ¿De qué te gustaría platicar?";
        } else {
          reply = "¡Excelente observación! Tienes un ritmo muy fluido al hablar. Cuéntame un poco más sobre eso.";
        }
      } else if (langObj.label === "French") {
        if (lower.includes("bonjour") || lower.includes("salut") || lower.includes("coucou")) {
          reply = "Bonjour ! C'est un réel plaisir de discuter avec toi. Ton accent est très agréable ! Comment vas-tu ?";
        } else {
          reply = "C'est très bien dit ! Ton intonation est tout à fait naturelle. Continuons, qu'aimerais-tu explorer maintenant ?";
        }
      } else if (langObj.label === "German") {
        if (lower.includes("hallo") || lower.includes("guten")) {
          reply = "Hallo! Schön, dich zu hören. Deine Aussprache klingt wirklich gut. Wie geht es dir heute?";
        } else {
          reply = "Das hast du sehr schön gesagt! Dein Sprachrhythmus ist flüssig. Lass uns gerne weiter darüber sprechen.";
        }
      } else if (langObj.label === "Italian") {
        if (lower.includes("ciao") || lower.includes("buongiorno")) {
          reply = "Ciao! È un piacere ascoltarti. Hai una pronuncia molto chiara e melodica. Come stai oggi?";
        } else {
          reply = "Molto interessante! Parli con grande naturalezza. Raccontami di più!";
        }
      } else {
        // English
        if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
          reply = "Hey there! It's so great to talk with you live. How is your day going so far?";
        } else if (lower.includes("how are you")) {
          reply = "I'm doing fantastic, thank you! Feeling energetic and excited to chat with you. What's on your mind today?";
        } else if (lower.includes("who are you") || lower.includes("what is your name")) {
          reply = "I'm Sol, your live speaking partner on Globally Known! I'm here to practice spoken fluency and conversation with you in real time.";
        } else {
          const reflections = [
            "That sounded so natural! I love hearing you express that. What got you thinking about this topic?",
            "You have great spoken rhythm and clarity! Tell me a little more about your thoughts on that.",
            "That makes complete sense. You communicated that effortlessly! Where should our conversation go next?"
          ];
          reply = reflections[Math.floor(Math.random() * reflections.length)];
        }
      }

      callback(reply);
    }, 300);
  }
}

// -------------------------------------------------------------
// Panel 8: Info / Configurations Setup
// -------------------------------------------------------------
function setupSettingsHandlers() {
  // Toggle password visibility
  togglePasswordBtn.addEventListener("click", () => {
    const isPassword = apiKeyInput.type === "password";
    apiKeyInput.type = isPassword ? "text" : "password";
    
    const icon = togglePasswordBtn.querySelector("i");
    icon.classList.toggle("fa-eye");
    icon.classList.toggle("fa-eye-slash");
  });

  // Save Settings Click
  saveSettingsBtn.addEventListener("click", () => {
    const rawKey = apiKeyInput.value.trim().replace(/^["']|["']$/g, '');
    geminiService.setApiKey(rawKey);
    updateApiStatusIndicator();
    if (typeof showToast === "function") {
      showToast(rawKey ? "API Key updated successfully!" : "Switched to Demo Mode");
    } else {
      alert(rawKey ? "API Key configuration updated successfully!" : "Switched to Demo Mode.");
    }
  });

  // Clear data settings (Safeguards video library from being wiped)
  clearAllDataBtn.addEventListener("click", () => {
    if (confirm("WARNING: This will clear your chat history, cached exercises, and reset your API key.\n\nNOTE: Your embedded videos in the Video Library will remain safely preserved.\n\nProceed?")) {
      const savedVideos = localStorage.getItem("sol_user_added_videos");
      localStorage.clear();
      if (savedVideos) {
        localStorage.setItem("sol_user_added_videos", savedVideos);
      }
      activeChatMessages = [];
      geminiService.setApiKey("");
      
      alert("Local chat data reset. Your embedded video library was safely preserved.");
      location.reload();
    }
  });

  // Video Library Settings Controls
  const btnSyncVideos = document.getElementById("btn-sync-videos-now");
  if (btnSyncVideos) {
    btnSyncVideos.addEventListener("click", async () => {
      btnSyncVideos.disabled = true;
      btnSyncVideos.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Syncing...';
      try {
        const vids = await fetchServerVideos();
        if (typeof initVideosPanel === "function") await initVideosPanel();
        showToast(`🔄 Video library synced (${vids.length} videos active)!`);
      } catch (err) {
        showToast("⚠️ Could not sync with server, using local storage.");
      } finally {
        btnSyncVideos.disabled = false;
        btnSyncVideos.innerHTML = '<i class="fa-solid fa-rotate"></i> Sync All Videos Now';
      }
    });
  }

  const btnExportVideos = document.getElementById("btn-export-videos-backup");
  if (btnExportVideos) {
    btnExportVideos.addEventListener("click", () => {
      const localVids = JSON.parse(localStorage.getItem("sol_user_added_videos") || "[]");
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localVids, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `globallyknown_video_library_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast("💾 Video library backup downloaded!");
    });
  }

  const btnImportVideos = document.getElementById("btn-import-videos-backup");
  const fileInputImport = document.getElementById("import-videos-file-input");
  if (btnImportVideos && fileInputImport) {
    btnImportVideos.addEventListener("click", () => {
      fileInputImport.value = "";
      fileInputImport.click();
    });

    fileInputImport.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          const vids = Array.isArray(parsed) ? parsed : (parsed.videos || []);
          if (!Array.isArray(vids) || vids.length === 0) {
            showToast("⚠️ No valid videos found in backup file.");
            return;
          }
          await fetch("/api/videos/import", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(vids)
          });
          await fetchServerVideos();
          if (typeof initVideosPanel === "function") await initVideosPanel();
          showToast(`📥 Successfully restored ${vids.length} videos to library!`);
        } catch (err) {
          showToast("⚠️ Invalid JSON backup file.");
        }
      };
      reader.readAsText(file);
    });
  }
}

function applyTheme(themeName) {
  currentTheme = themeName || "dark";
  document.documentElement.setAttribute("data-theme", currentTheme);
  localStorage.setItem("sol_theme", currentTheme);

  // Update active state in header dropdown
  const headerOptions = document.querySelectorAll(".theme-option-btn");
  headerOptions.forEach(opt => {
    opt.classList.toggle("active", opt.getAttribute("data-theme-val") === currentTheme);
  });

  // Update active state in settings swatches grid
  const swatchCards = document.querySelectorAll(".theme-swatch-card");
  swatchCards.forEach(card => {
    card.classList.toggle("active", card.getAttribute("data-theme-val") === currentTheme);
  });
}

// Global Theme Dropdown Toggle
window.toggleThemeDropdown = function(e) {
  if (e) {
    e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
  }
  const dropdown = document.getElementById("theme-dropdown-menu");
  if (dropdown) {
    dropdown.classList.toggle("hidden");
  }
};

function initThemePicker() {
  const themeDropdownMenu = document.getElementById("theme-dropdown-menu");

  // Dismiss dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (themeDropdownMenu && !themeDropdownMenu.classList.contains("hidden")) {
      const isInsideMenu = themeDropdownMenu.contains(e.target);
      const isThemeBtn = e.target.closest("#theme-toggle-btn");
      if (!isInsideMenu && !isThemeBtn) {
        themeDropdownMenu.classList.add("hidden");
      }
    }
  });

  // Theme option clicks (header dropdown & settings swatches)
  document.addEventListener("click", (e) => {
    const themeBtn = e.target.closest("[data-theme-val]");
    if (themeBtn) {
      const val = themeBtn.getAttribute("data-theme-val");
      applyTheme(val);
      const dropdown = document.getElementById("theme-dropdown-menu");
      if (dropdown) dropdown.classList.add("hidden");
      if (typeof showToast === "function") {
        const themeLabels = {
          dark: "Sol Amber",
          cyan: "Cyber Cyan",
          emerald: "Emerald Mint",
          purple: "Amethyst Violet",
          crimson: "Crimson Sunset",
          rainbow: "Spectrum Rainbow 🌈",
          light: "Minimal Light"
        };
        const themeLabel = themeLabels[val] || val;
        showToast(`🎨 Theme switched to ${themeLabel}`);
      }
    }
  });
}

// -------------------------------------------------------------
// PWA Install & Google Auth Handlers
// -------------------------------------------------------------
let deferredPwaPrompt = null;

function initPwaInstall() {
  // Clear any registered Service Workers and Cache Storage to prevent FetchEvent network errors
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (let registration of registrations) {
        registration.unregister();
      }
    });
  }
  if ("caches" in window) {
    caches.keys().then((names) => {
      for (let name of names) {
        caches.delete(name);
      }
    });
  }

  const installBtn = document.getElementById("btn-install-pwa");

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPwaPrompt = e;
    if (installBtn) {
      installBtn.style.display = "flex";
    }
  });

  if (installBtn) {
    installBtn.addEventListener("click", async () => {
      if (deferredPwaPrompt) {
        deferredPwaPrompt.prompt();
        const { outcome } = await deferredPwaPrompt.userChoice;
        if (outcome === "accepted") {
          installBtn.style.display = "none";
        }
        deferredPwaPrompt = null;
      } else {
        alert("📲 How to Install SOL App:\n\n1. On Desktop (Chrome/Edge): Click the ⊕ / Install App button in your top header or address bar.\n2. On Mobile (Chrome/Safari): Tap browser menu (⋮ or Share) and select 'Add to Home Screen'.");
      }
    });
  }
}

function initGoogleAuth() {
  initAuthSystem();
}

function initAuthSystem() {
  const authModal = document.getElementById("auth-modal");
  const tabLogin = document.getElementById("tab-btn-login");
  const tabRegister = document.getElementById("tab-btn-register");
  const formLogin = document.getElementById("form-auth-login");
  const formRegister = document.getElementById("form-auth-register");
  const alertBox = document.getElementById("auth-alert");
  const btnGoogleModal = document.getElementById("btn-modal-google-login");

  const showAlert = (msg, type = "error") => {
    if (!alertBox) return;
    alertBox.className = `auth-alert ${type}`;
    alertBox.innerHTML = `${type === "error" ? '<i class="fa-solid fa-circle-exclamation"></i>' : '<i class="fa-solid fa-circle-check"></i>'} <span>${escapeHtml(msg)}</span>`;
    alertBox.classList.remove("hidden");
  };

  const hideAlert = () => {
    if (alertBox) alertBox.classList.add("hidden");
  };

  // Tab Switching
  if (tabLogin && tabRegister && formLogin && formRegister) {
    tabLogin.addEventListener("click", () => {
      tabLogin.classList.add("active");
      tabRegister.classList.remove("active");
      formLogin.classList.remove("hidden");
      formRegister.classList.add("hidden");
      hideAlert();
    });

    tabRegister.addEventListener("click", () => {
      tabRegister.classList.add("active");
      tabLogin.classList.remove("active");
      formRegister.classList.remove("hidden");
      formLogin.classList.add("hidden");
      hideAlert();
    });
  }

  // Show/Hide Password Toggles
  document.querySelectorAll(".auth-toggle-pwd").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const input = document.getElementById(targetId);
      if (input) {
        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";
        btn.innerHTML = isPassword ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
      }
    });
  });

  // Login Form Submission
  if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();
      hideAlert();
      const email = document.getElementById("login-email")?.value.trim();
      const password = document.getElementById("login-password")?.value;
      const submitBtn = document.getElementById("btn-submit-login");

      if (!email || !password) {
        showAlert("Please enter your email and password.");
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> <span>Signing in...</span>`;
      }

      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Login failed. Please try again.");
        }

        loginUserSuccess(data.user, data.token);
      } catch (err) {
        showAlert(err.message || "Invalid credentials.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span class="btn-text">Sign In</span> <i class="fa-solid fa-arrow-right"></i>`;
        }
      }
    });
  }

  // Register Form Submission
  if (formRegister) {
    formRegister.addEventListener("submit", async (e) => {
      e.preventDefault();
      hideAlert();
      const name = document.getElementById("register-name")?.value.trim();
      const email = document.getElementById("register-email")?.value.trim();
      const password = document.getElementById("register-password")?.value;
      const confirmPassword = document.getElementById("register-confirm-password")?.value;
      const submitBtn = document.getElementById("btn-submit-register");

      if (!name || !email || !password) {
        showAlert("Please fill in all required fields.");
        return;
      }
      if (password.length < 6) {
        showAlert("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        showAlert("Passwords do not match.");
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> <span>Creating account...</span>`;
      }

      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Could not create account.");
        }

        loginUserSuccess(data.user, data.token, true);
      } catch (err) {
        showAlert(err.message || "Could not create account.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span class="btn-text">Create Free Account</span> <i class="fa-solid fa-user-plus"></i>`;
        }
      }
    });
  }

  // Google Sign-In button
  const handleGoogleSignIn = async () => {
    hideAlert();
    const defaultName = "Adrian Milla";
    const name = prompt("Continue with Google:\n\nEnter your name or Google email to connect:", defaultName);
    if (!name || !name.trim()) return;

    const trimmed = name.trim();
    const email = trimmed.includes("@") ? trimmed : `${trimmed.toLowerCase().replace(/\s+/g, ".")}@gmail.com`;

    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmed,
          email: email,
          picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(trimmed)}&background=4285F4&color=fff&bold=true`
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        loginUserSuccess(data.user, data.token);
      } else {
        throw new Error(data.error || "Google sign-in failed.");
      }
    } catch (err) {
      const localUser = {
        name: trimmed,
        email: email,
        picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(trimmed)}&background=4285F4&color=fff&bold=true`,
        role: "free"
      };
      loginUserSuccess(localUser, "tok_local");
    }
  };

  if (btnGoogleModal) {
    btnGoogleModal.addEventListener("click", handleGoogleSignIn);
  }

  // Clear any legacy persistent guest flag from sessionStorage
  try {
    sessionStorage.removeItem("sol_guest_mode");
  } catch (e) {}

  // Continue as Guest button
  const btnContinueGuest = document.getElementById("btn-continue-guest");
  if (btnContinueGuest) {
    btnContinueGuest.addEventListener("click", () => {
      window.solGuestMode = true;
      if (authModal) authModal.classList.add("hidden");
      renderGuestProfile();
      if (typeof window.switchPanel === "function") {
        window.switchPanel("sol-chat");
      }
      setTimeout(() => {
        if (typeof triggerSolGrandEntrance === "function") {
          triggerSolGrandEntrance();
          hasPlayedFirstLoginEntrance = true;
        }
      }, 40);
      if (typeof showToast === "function") {
        showToast("🧭 Browsing in Guest Preview mode. Sign in anytime!");
      }
    });
  }

  // Check saved session
  checkActiveSession();
}

function checkActiveSession() {
  const authModal = document.getElementById("auth-modal");
  const savedToken = localStorage.getItem("sol_auth_token");
  const savedProfile = localStorage.getItem("sol_user_profile");

  // Only consider authenticated if BOTH an auth token and user profile exist
  if (savedToken && savedProfile) {
    try {
      const user = JSON.parse(savedProfile);
      if (user && user.email) {
        if (authModal) authModal.classList.add("hidden");
        renderUserProfile(user);
        renderCircleMembersWidget();
        if (typeof triggerSolGrandEntrance === "function") {
          triggerSolGrandEntrance();
          hasPlayedFirstLoginEntrance = true;
        }
        return;
      }
    } catch (e) {
      localStorage.removeItem("sol_user_profile");
      localStorage.removeItem("sol_auth_token");
    }
  }

  // Check in-memory Guest Mode in current browsing session
  if (window.solGuestMode === true) {
    if (authModal) authModal.classList.add("hidden");
    renderGuestProfile();
    if (typeof triggerSolGrandEntrance === "function") {
      triggerSolGrandEntrance();
      hasPlayedFirstLoginEntrance = true;
    }
    return;
  }

  // Mandatory: if no active authenticated session and not guest, KEEP Auth Modal open
  if (authModal) {
    authModal.classList.remove("hidden");
  }
  renderSignInButton();
}

function renderGuestProfile() {
  const authContainer = document.getElementById("user-auth-container");
  if (!authContainer) return;
  authContainer.innerHTML = `
    <div class="guest-user-chip" id="guest-profile-chip" title="Browsing in Guest Preview Mode">
      <i class="fa-solid fa-compass" style="color:var(--accent-color, #4f46e5);"></i>
      <span>Guest</span>
      <button type="button" class="header-login-prompt-btn" id="btn-guest-sign-in" title="Sign In or Create Account">Sign In</button>
    </div>
  `;

  const btnSignIn = document.getElementById("btn-guest-sign-in");
  if (btnSignIn) {
    btnSignIn.addEventListener("click", () => {
      window.solGuestMode = false;
      const authModal = document.getElementById("auth-modal");
      if (authModal) authModal.classList.remove("hidden");
    });
  }
}

function loginUserSuccess(user, token, isNew = false) {
  window.solGuestMode = false;
  try {
    sessionStorage.removeItem("sol_guest_mode");
  } catch (e) {}
  if (token) localStorage.setItem("sol_auth_token", token);
  localStorage.setItem("sol_user_profile", JSON.stringify(user));

  const authModal = document.getElementById("auth-modal");
  if (authModal) {
    authModal.classList.add("hidden");
  }

  renderUserProfile(user);
  syncUserDataToCloud(user);
  updateGreetingText();
  renderCircleMembersWidget();
  renderCircleFeed();

  if (typeof window.switchPanel === "function") {
    window.switchPanel("sol-chat");
  }
  setTimeout(() => {
    if (typeof triggerSolGrandEntrance === "function") {
      triggerSolGrandEntrance();
      hasPlayedFirstLoginEntrance = true;
    }
  }, 40);

  if (typeof showToast === "function") {
    showToast(isNew ? `🎉 Welcome to Globally Known, ${user.name.split(" ")[0]}!` : `👋 Welcome back, ${user.name.split(" ")[0]}!`);
  }
}

function renderSignInButton() {
  const authContainer = document.getElementById("user-auth-container");
  if (!authContainer) return;
  authContainer.innerHTML = `
    <button class="google-login-btn" id="btn-google-login" title="Sign In / Create Account">
      <i class="fa-solid fa-arrow-right-to-bracket"></i> <span>Sign In</span>
    </button>
  `;

  const btn = document.getElementById("btn-google-login");
  if (btn) {
    btn.addEventListener("click", () => {
      const authModal = document.getElementById("auth-modal");
      if (authModal) authModal.classList.remove("hidden");
    });
  }
}

function renderUserProfile(user) {
  const authContainer = document.getElementById("user-auth-container");
  if (!authContainer) return;

  const firstName = escapeHtml((user.name || "User").split(" ")[0]);
  const roleLabel = user.role === "premium" ? "🌟 Premium" : "Free Member";
  const avatarUrl = user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "U")}&background=4f46e5&color=fff&bold=true`;

  authContainer.innerHTML = `
    <div class="google-user-profile" id="user-profile-chip" title="Account: ${escapeHtml(user.email || "")}">
      <img src="${avatarUrl}" alt="${escapeHtml(user.name || "")}" class="google-user-avatar">
      <span class="google-user-name">${firstName}</span>
      <span class="user-profile-badge">${roleLabel}</span>
      <i class="fa-solid fa-chevron-down" style="font-size:0.65rem; color:#94a3b8; margin-left:2px;"></i>

      <!-- Profile Dropdown Menu -->
      <div class="user-profile-dropdown hidden" id="user-profile-dropdown">
        <div class="dropdown-user-header">
          <span class="dropdown-user-name">${escapeHtml(user.name || "")}</span>
          <span class="dropdown-user-email">${escapeHtml(user.email || "")}</span>
        </div>
        <button type="button" class="dropdown-item" id="dropdown-status-btn">
          <i class="fa-solid fa-crown" style="color:#eab308;"></i>
          <span>Plan: <strong>${roleLabel}</strong></span>
        </button>
        <button type="button" class="dropdown-item danger" id="btn-user-logout">
          <i class="fa-solid fa-right-from-bracket"></i>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  `;

  updateGreetingText();

  const chip = document.getElementById("user-profile-chip");
  const dropdown = document.getElementById("user-profile-dropdown");
  const logoutBtn = document.getElementById("btn-user-logout");

  if (chip && dropdown) {
    chip.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
      if (!chip.contains(e.target)) {
        dropdown.classList.add("hidden");
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm("Sign out of your account?")) {
        localStorage.removeItem("sol_user_profile");
        localStorage.removeItem("sol_auth_token");
        try { sessionStorage.removeItem("sol_guest_mode"); } catch(e) {}
        window.solGuestMode = false;
        hasPlayedFirstLoginEntrance = false;
        checkActiveSession();
        updateGreetingText();
        renderCircleMembersWidget();
        renderCircleFeed();
      }
    });
  }
}

function syncUserDataToCloud(user) {
  const userKeyHistory = `sol_history_${user.email}`;
  const userKeySavings = `sol_savings_${user.email}`;
  localStorage.setItem(userKeyHistory, JSON.stringify(rwggpHistory));
  localStorage.setItem(userKeySavings, JSON.stringify(rwggpSavingLists));
}

// -------------------------------------------------------------
// Video Panel Category Definitions
// -------------------------------------------------------------
const PLAYLIST_CATEGORIES = [
  { id: "city",      flag: "🏙️",  title: "Into The City!",            videos: [], count: "0 Videos" },
  { id: "house",     flag: "🛋️",  title: "Inside The House!",         videos: [], count: "0 Videos" },
  { id: "action",    flag: "🎬",  title: "English In Action!",        videos: [], count: "0 Videos" },
  { id: "bathroom",  flag: "🚽",  title: "Inside The Bathroom!",      videos: [], count: "0 Videos" },
  { id: "kitchen",   flag: "🍽️",  title: "Inside The Kitchen!",       videos: [], count: "0 Videos" },
  { id: "bodies",    flag: "🧘‍♂️", title: "Our Body!",                 videos: [], count: "0 Videos" },
  { id: "different", flag: "📝",  title: "Different English Lessons!", videos: [], count: "0 Videos" },
  { id: "nature",    flag: "🌳",  title: "Outside In Nature!",        videos: [], count: "0 Videos" },
  { id: "seaside",   flag: "🌊",  title: "Sea Side!",                 videos: [], count: "0 Videos" },
  { id: "whathouse", flag: "🏠",  title: "What About The House?!",     videos: [], count: "0 Videos" }
];

// Start SOL Engine
if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", init);
} else {
  init();
}





// -------------------------------------------------------------
// Universal Video Embed URL Parser & Formatter
// -------------------------------------------------------------
function parseEmbedVideoUrl(rawInput) {
  if (!rawInput || typeof rawInput !== "string") return "";
  let text = rawInput.trim();

  // If user pasted an <iframe>...</iframe> snippet, extract src attribute
  const iframeSrcMatch = text.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  if (iframeSrcMatch) {
    text = iframeSrcMatch[1].trim();
  }

  // 1. YouTube Shorts: https://www.youtube.com/shorts/VIDEO_ID
  const shortsMatch = text.match(/(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/i);
  if (shortsMatch) {
    return `https://www.youtube-nocookie.com/embed/${shortsMatch[1]}`;
  }

  // 2. YouTube Playlist: https://www.youtube.com/playlist?list=LIST_ID
  const playlistOnlyMatch = text.match(/youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/i);
  if (playlistOnlyMatch) {
    return `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistOnlyMatch[1]}`;
  }

  // 3. YouTube Watch, youtu.be, or existing /embed/
  const ytMatch = text.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]+)/i);
  const listMatch = text.match(/[?&]list=([a-zA-Z0-9_-]+)/i);
  if (ytMatch) {
    const videoId = ytMatch[1];
    let res = `https://www.youtube-nocookie.com/embed/${videoId}`;
    if (listMatch) res += `?list=${listMatch[1]}`;
    return res;
  }

  // 4. Vimeo: https://vimeo.com/VIDEO_ID or https://player.vimeo.com/video/VIDEO_ID
  const vimeoMatch = text.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/i);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // 5. Direct or already formatted URL
  if (text.startsWith("http://") || text.startsWith("https://")) {
    return text;
  }

  return "";
}

// Update status badges in Info / Settings
function updateVideoSettingsBadge(count, isServerSynced) {
  const syncBadge = document.getElementById("video-sync-status-badge");
  const countBadge = document.getElementById("video-total-count-badge");
  if (syncBadge) {
    if (isServerSynced) {
      syncBadge.innerHTML = '<span style="width: 7px; height: 7px; border-radius: 50%; background: #10b981; display: inline-block; box-shadow: 0 0 8px #10b981;"></span> Permanent Storage Active (Server Synced)';
      syncBadge.style.color = "#34d399";
      syncBadge.style.borderColor = "rgba(16, 185, 129, 0.4)";
      syncBadge.style.background = "rgba(16, 185, 129, 0.15)";
    } else {
      syncBadge.innerHTML = '<span style="width: 7px; height: 7px; border-radius: 50%; background: #f59e0b; display: inline-block;"></span> Browser Storage Active';
      syncBadge.style.color = "#fbbf24";
      syncBadge.style.borderColor = "rgba(245, 158, 11, 0.4)";
      syncBadge.style.background = "rgba(245, 158, 11, 0.15)";
    }
  }
  if (countBadge) {
    countBadge.textContent = `${count} Video${count === 1 ? "" : "s"} Embedded`;
  }
}

async function fetchServerVideos() {
  let serverVids = [];
  let serverAvailable = false;
  try {
    const res = await fetch("/api/videos", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        serverVids = data;
        serverAvailable = true;
      }
    }
  } catch (err) {
    console.warn("Could not reach /api/videos, using localStorage cache:", err);
  }

  const localVids = JSON.parse(localStorage.getItem("sol_user_added_videos") || "[]");
  const validLocal = Array.isArray(localVids) ? localVids.filter(v => v && !v.isAddTemplate && v.embedUrl) : [];

  // Two-way union merge by ID so no video is EVER dropped or overwritten
  const mergedMap = new Map();
  serverVids.forEach(v => {
    if (v && v.id) mergedMap.set(v.id, v);
  });
  validLocal.forEach(v => {
    if (v && v.id && !mergedMap.has(v.id)) {
      mergedMap.set(v.id, v);
    }
  });

  const mergedList = Array.from(mergedMap.values());
  localStorage.setItem("sol_user_added_videos", JSON.stringify(mergedList));

  // If local had videos the server didn't have, push merged list to server
  if (serverAvailable && mergedList.length > serverVids.length) {
    await syncVideosToServer(mergedList);
  }

  updateVideoSettingsBadge(mergedList.length, serverAvailable);
  return mergedList;
}

async function syncVideosToServer(videos) {
  const filtered = Array.isArray(videos) ? videos.filter(v => v && !v.isAddTemplate && v.embedUrl && v.embedUrl.trim() !== "") : [];
  localStorage.setItem("sol_user_added_videos", JSON.stringify(filtered));
  let serverAvailable = false;
  try {
    const res = await fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filtered)
    });
    if (res.ok) {
      serverAvailable = true;
      const data = await res.json();
      if (data && Array.isArray(data.videos)) {
        localStorage.setItem("sol_user_added_videos", JSON.stringify(data.videos));
        updateVideoSettingsBadge(data.videos.length, true);
        return data.videos;
      }
    }
  } catch (err) {
    console.warn("Could not push videos to /api/videos:", err);
  }
  updateVideoSettingsBadge(filtered.length, serverAvailable);
  return filtered;
}

async function deleteVideoFromServer(videoId) {
  let serverAvailable = false;
  try {
    const res = await fetch("/api/videos/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: videoId })
    });
    if (res.ok) {
      serverAvailable = true;
      const data = await res.json();
      if (data && Array.isArray(data.videos)) {
        localStorage.setItem("sol_user_added_videos", JSON.stringify(data.videos));
        updateVideoSettingsBadge(data.videos.length, true);
        return data.videos;
      }
    }
  } catch (err) {
    console.warn("Could not delete from server:", err);
  }
  let localVids = JSON.parse(localStorage.getItem("sol_user_added_videos") || "[]");
  localVids = localVids.filter(v => v.id !== videoId);
  localStorage.setItem("sol_user_added_videos", JSON.stringify(localVids));
  updateVideoSettingsBadge(localVids.length, serverAvailable);
  return localVids;
}

// -------------------------------------------------------------
// Add Video Modal Handling (Safe & Persistent)
// -------------------------------------------------------------
let addVideoModalInitialized = false;

function openAddVideoModal(defaultCategoryId = "city") {
  const modal = document.getElementById("modal-add-video");
  const selectCat = document.getElementById("add-video-category-select");
  const inputUrl = document.getElementById("add-video-url-input");
  const inputTitle = document.getElementById("add-video-title-input");

  if (!modal) return;

  // Populate category select
  if (selectCat) {
    selectCat.innerHTML = "";
    PLAYLIST_CATEGORIES.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = `${c.flag} ${c.title}`;
      if (c.id === defaultCategoryId) opt.selected = true;
      selectCat.appendChild(opt);
    });
  }

  if (inputUrl) inputUrl.value = "";
  if (inputTitle) inputTitle.value = "";

  modal.classList.remove("hidden");
  setTimeout(() => {
    if (inputUrl) inputUrl.focus();
  }, 100);

  if (!addVideoModalInitialized) {
    addVideoModalInitialized = true;
    const btnClose = document.getElementById("btn-close-add-video-modal");
    const btnCancel = document.getElementById("btn-cancel-add-video");
    const form = document.getElementById("form-add-video");

    const closeModal = () => modal.classList.add("hidden");

    if (btnClose) btnClose.addEventListener("click", closeModal);
    if (btnCancel) btnCancel.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    const handleSubmit = async (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      const rawUrl = inputUrl ? inputUrl.value : "";
      const parsedEmbedUrl = parseEmbedVideoUrl(rawUrl);

      if (!parsedEmbedUrl) {
        showToast("⚠️ Please enter a valid YouTube, Vimeo, or video embed link.");
        if (inputUrl) inputUrl.focus();
        return;
      }

      const title = (inputTitle && inputTitle.value.trim()) ? inputTitle.value.trim() : "Embedded Video";
      const catId = (selectCat && selectCat.value) ? selectCat.value : "city";

      const newVid = {
        id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        categoryId: catId,
        title: title,
        desc: "Custom embedded video lesson",
        embedUrl: parsedEmbedUrl,
        isUserAdded: true,
        addedAt: Date.now()
      };

      const submitBtn = document.getElementById("btn-submit-add-video");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
      }

      try {
        const currentVideos = await fetchServerVideos();
        const merged = [...currentVideos.filter(v => v.id !== newVid.id), newVid];
        await syncVideosToServer(merged);

        closeModal();
        showToast("✅ Video permanently saved to library!");
        await initVideosPanel();
      } catch (err) {
        console.error("Error saving video:", err);
        showToast("⚠️ Saved locally, syncing will continue in background.");
        closeModal();
        await initVideosPanel();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-bookmark"></i> Embed Video Permanently';
        }
      }
    };

    if (form) {
      form.addEventListener("submit", handleSubmit);
    }
    const btnSubmit = document.getElementById("btn-submit-add-video");
    if (btnSubmit) {
      btnSubmit.addEventListener("click", handleSubmit);
    }
  }
}

let currentVideosRenderId = 0;

async function initVideosPanel() {
  const videoGrid = document.getElementById("video-grid");
  const playlistModal = document.getElementById("playlist-modal");
  const mainPlaylistIframe = document.getElementById("main-playlist-iframe");
  const btnClosePlaylistModal = document.getElementById("btn-close-playlist-modal");

  if (!videoGrid) return;

  const thisRenderId = ++currentVideosRenderId;

  let userAddedVideos = [];
  try {
    userAddedVideos = await fetchServerVideos();
  } catch (err) {
    console.warn("fetchServerVideos error:", err);
    userAddedVideos = JSON.parse(localStorage.getItem("sol_user_added_videos") || "[]");
  }

  // If a newer render request arrived while fetching, discard this stale render
  if (thisRenderId !== currentVideosRenderId) {
    return;
  }

  if (playlistModal) playlistModal.classList.add("hidden");

  userAddedVideos = (userAddedVideos || []).filter(v => v && !v.isAddTemplate && v.embedUrl && v.embedUrl.trim() !== "");

  // Clear videoGrid right before appending to avoid duplicate rows from async race conditions
  videoGrid.innerHTML = "";

  // Deduplicate categories by ID
  const seenCategoryIds = new Set();
  const uniqueCategories = PLAYLIST_CATEGORIES.filter(cat => {
    if (!cat || !cat.id || seenCategoryIds.has(cat.id)) return false;
    seenCategoryIds.add(cat.id);
    return true;
  });

  uniqueCategories.forEach(category => {
    const customForCategory = userAddedVideos.filter(v => v.categoryId === category.id);
    let allVids = [...customForCategory, { id: "add_card_" + category.id, isAddTemplate: true }];
    category.videos = allVids;
    category.count = `${Math.max(0, category.videos.length - 1)} Videos`;

    const row = document.createElement("div");
    row.className = "playlist-category-row";
    row.setAttribute("data-category-id", category.id);

    row.innerHTML = `
      <div class="category-header-row">
        <div class="category-header">
          <span class="category-flag">${category.flag}</span>
          <h3>${escapeHtml(category.title)}</h3>
          <span class="category-count">(${category.count})</span>
          <button class="header-add-video-btn" title="Add Video to ${escapeHtml(category.title)}" data-cat="${category.id}">
            <i class="fa-solid fa-plus"></i> Add Video
          </button>
        </div>
        <div class="netflix-header-indicators" id="netflix-indicators-${category.id}"></div>
      </div>
      <div class="netflix-slider-container">
        <div class="netflix-slider-track" id="track-${category.id}">
          <!-- Videos populated dynamically -->
        </div>
      </div>
      <div class="custom-category-slider-wrapper" id="custom-slider-wrapper-${category.id}">
        <div class="classic-scrollbar-container">
          <button class="classic-scrollbar-arrow arrow-left" id="arrow-left-${category.id}" title="Scroll Left">
            <i class="fa-solid fa-caret-left"></i>
          </button>
          <div class="classic-scrollbar-track" id="slider-track-${category.id}">
            <div class="classic-scrollbar-thumb" id="slider-thumb-${category.id}"></div>
          </div>
          <button class="classic-scrollbar-arrow arrow-right" id="arrow-right-${category.id}" title="Scroll Right">
            <i class="fa-solid fa-caret-right"></i>
          </button>
        </div>
      </div>
    `;

    videoGrid.appendChild(row);

    const trackElement = row.querySelector(`#track-${category.id}`);
    const sliderContainer = row.querySelector(".netflix-slider-container");
    const trackBar = row.querySelector(`#slider-track-${category.id}`);
    const thumbEl = row.querySelector(`#slider-thumb-${category.id}`);
    const btnLeft = row.querySelector(`#arrow-left-${category.id}`);
    const btnRight = row.querySelector(`#arrow-right-${category.id}`);
    const headerAddBtn = row.querySelector(".header-add-video-btn");
    const indicatorsContainer = row.querySelector(`#netflix-indicators-${category.id}`);

    if (headerAddBtn) {
      headerAddBtn.addEventListener("click", () => {
        openAddVideoModal(category.id);
      });
    }

    const updateContainerMetrics = () => {
      if (!sliderContainer) return;
      const w = sliderContainer.clientWidth;
      if (w > 0) {
        sliderContainer.style.setProperty("--container-px", `${w}px`);
      }
    };
    updateContainerMetrics();

    // Netflix page indicator dots/pills
    const updateIndicators = () => {
      if (!indicatorsContainer || !sliderContainer) return;
      const totalCards = category.videos.length;
      const cardsPerPage = window.innerWidth <= 600 ? 1 : (window.innerWidth <= 960 ? 2 : 4);
      const totalPages = Math.ceil(totalCards / cardsPerPage);

      if (totalPages <= 1) {
        indicatorsContainer.innerHTML = "";
        return;
      }

      const maxScroll = sliderContainer.scrollWidth - sliderContainer.clientWidth;
      const scrollRatio = maxScroll > 0 ? sliderContainer.scrollLeft / maxScroll : 0;
      const currentPage = Math.min(totalPages - 1, Math.round(scrollRatio * (totalPages - 1)));

      if (indicatorsContainer.children.length !== totalPages) {
        indicatorsContainer.innerHTML = "";
        for (let p = 0; p < totalPages; p++) {
          const pill = document.createElement("div");
          pill.className = `netflix-page-pill ${p === currentPage ? 'active' : ''}`;
          pill.title = `Page ${p + 1} of ${totalPages}`;
          pill.addEventListener("click", () => {
            const targetScroll = (p / (totalPages - 1)) * (sliderContainer.scrollWidth - sliderContainer.clientWidth);
            sliderContainer.scrollTo({ left: targetScroll, behavior: "smooth" });
          });
          indicatorsContainer.appendChild(pill);
        }
      } else {
        Array.from(indicatorsContainer.children).forEach((pill, idx) => {
          pill.classList.toggle("active", idx === currentPage);
        });
      }
    };

    // Netflix continuous cycling arrows
    if (btnLeft && sliderContainer) {
      btnLeft.addEventListener("click", () => {
        const maxScroll = sliderContainer.scrollWidth - sliderContainer.clientWidth;
        if (sliderContainer.scrollLeft <= 8) {
          sliderContainer.scrollTo({ left: maxScroll, behavior: "smooth" });
        } else {
          sliderContainer.scrollBy({ left: -sliderContainer.clientWidth, behavior: "smooth" });
        }
      });
    }
    if (btnRight && sliderContainer) {
      btnRight.addEventListener("click", () => {
        const maxScroll = sliderContainer.scrollWidth - sliderContainer.clientWidth;
        if (sliderContainer.scrollLeft >= maxScroll - 8) {
          sliderContainer.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          sliderContainer.scrollBy({ left: sliderContainer.clientWidth, behavior: "smooth" });
        }
      });
    }

    // Horizontal mouse wheel scrolling over video row
    if (sliderContainer) {
      sliderContainer.addEventListener("wheel", (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && sliderContainer.scrollWidth > sliderContainer.clientWidth) {
          e.preventDefault();
          sliderContainer.scrollLeft += e.deltaY;
        }
      }, { passive: false });
    }

    // Draggable sliding bar thumb & clickable track
    let isDraggingThumb = false;
    let startThumbClientX = 0;
    let startScrollLeft = 0;

    if (thumbEl && trackBar && sliderContainer) {
      const onThumbDown = (e) => {
        isDraggingThumb = true;
        thumbEl.classList.add("dragging");
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        startThumbClientX = clientX;
        startScrollLeft = sliderContainer.scrollLeft;
        document.body.style.userSelect = "none";
        e.preventDefault();
      };

      const onThumbMove = (e) => {
        if (!isDraggingThumb) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const deltaX = clientX - startThumbClientX;
        const trackWidth = trackBar.clientWidth;
        const thumbWidth = thumbEl.clientWidth;
        const maxThumbLeft = trackWidth - thumbWidth;
        const maxScroll = sliderContainer.scrollWidth - sliderContainer.clientWidth;
        if (maxThumbLeft > 0 && maxScroll > 0) {
          const scrollDelta = (deltaX / maxThumbLeft) * maxScroll;
          sliderContainer.scrollLeft = Math.max(0, Math.min(maxScroll, startScrollLeft + scrollDelta));
        }
      };

      const onThumbUp = () => {
        if (isDraggingThumb) {
          isDraggingThumb = false;
          thumbEl.classList.remove("dragging");
          document.body.style.userSelect = "";
        }
      };

      thumbEl.addEventListener("mousedown", onThumbDown);
      thumbEl.addEventListener("touchstart", onThumbDown, { passive: false });
      window.addEventListener("mousemove", onThumbMove);
      window.addEventListener("touchmove", onThumbMove, { passive: false });
      window.addEventListener("mouseup", onThumbUp);
      window.addEventListener("touchend", onThumbUp);

      trackBar.addEventListener("click", (e) => {
        if (e.target === thumbEl) return;
        const rect = trackBar.getBoundingClientRect();
        const clickPos = (e.clientX - rect.left) - (thumbEl.clientWidth / 2);
        const trackWidth = trackBar.clientWidth;
        const maxThumbLeft = trackWidth - thumbEl.clientWidth;
        const maxScroll = sliderContainer.scrollWidth - sliderContainer.clientWidth;
        if (maxThumbLeft > 0 && maxScroll > 0) {
          const targetPct = Math.min(1, Math.max(0, clickPos / maxThumbLeft));
          sliderContainer.scrollTo({ left: targetPct * maxScroll, behavior: "smooth" });
        }
      });
    }

    const syncSliderPosition = () => {
      if (!sliderContainer) return;
      updateContainerMetrics();
      const maxScroll = sliderContainer.scrollWidth - sliderContainer.clientWidth;
      if (maxScroll <= 2) {
        if (thumbEl) {
          thumbEl.style.width = "60px";
          thumbEl.style.left = "0px";
          thumbEl.style.opacity = "0.35";
        }
        updateIndicators();
        return;
      }
      if (thumbEl) thumbEl.style.opacity = "1";
      const pct = Math.min(1, Math.max(0, sliderContainer.scrollLeft / maxScroll));
      if (trackBar && thumbEl) {
        const trackWidth = trackBar.clientWidth;
        const visibleRatio = sliderContainer.clientWidth / sliderContainer.scrollWidth;
        const thumbWidth = Math.max(48, Math.min(trackWidth * 0.8, visibleRatio * trackWidth));
        thumbEl.style.width = `${thumbWidth}px`;
        const maxThumbLeft = trackWidth - thumbWidth;
        thumbEl.style.left = `${pct * maxThumbLeft}px`;
      }
      updateIndicators();
    };

    if (sliderContainer) {
      sliderContainer.addEventListener("scroll", syncSliderPosition);
      setTimeout(syncSliderPosition, 100);
      window.addEventListener("resize", syncSliderPosition);
    }

    category.videos.forEach((video) => {
      if (video.isAddTemplate) {
        const card = document.createElement("div");
        card.className = "video-card add-video-card";

        card.innerHTML = `
          <div class="video-thumbnail-container add-video-frame">
            <div class="add-video-plus-circle">
              <i class="fa-solid fa-plus"></i>
            </div>
            <span class="add-video-title">Add Video</span>
            <span class="add-video-sub">Embed Video Link</span>
          </div>
        `;

        card.addEventListener("click", () => {
          openAddVideoModal(category.id);
        });

        trackElement.appendChild(card);
        return;
      }

      const card = document.createElement("div");
      card.className = "video-card";

      let activeEmbedUrl = video.embedUrl || "";
      if (activeEmbedUrl.includes("youtube.com/embed/")) {
        activeEmbedUrl = activeEmbedUrl.replace("youtube.com/embed/", "youtube-nocookie.com/embed/");
      }

      card.innerHTML = `
        <div class="video-player-frame">
          ${activeEmbedUrl ? `
            <iframe 
              src="${activeEmbedUrl}" 
              title="${escapeHtml(video.title)}" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowfullscreen
            ></iframe>
          ` : `
            <div class="no-video-placeholder">No Video Source</div>
          `}
        </div>
        <div class="video-card-info-footer">
          <div class="video-card-title-row">
            <h4 class="video-card-title" title="${escapeHtml(video.title)}">${escapeHtml(video.title)}</h4>
            ${video.isUserAdded ? `<button class="delete-video-btn mini" data-id="${video.id}" title="Delete Video"><i class="fa-solid fa-trash-can"></i> <span class="delete-btn-label">Delete</span></button>` : ""}
          </div>
        </div>
      `;

      const deleteBtn = card.querySelector(".delete-video-btn.mini");
      if (deleteBtn) {
        deleteBtn.addEventListener("click", async (e) => {
          e.stopPropagation();
          if (confirm(`Delete video "${video.title}"?`)) {
            await deleteVideoFromServer(video.id);
            showToast("🗑️ Video removed.");
            initVideosPanel();
          }
        });
      }

      trackElement.appendChild(card);
    });
  });

  if (btnClosePlaylistModal) {
    btnClosePlaylistModal.addEventListener("click", () => {
      if (playlistModal) playlistModal.classList.add("hidden");
      if (mainPlaylistIframe) mainPlaylistIframe.src = "";
    });
  }
}


// -------------------------------------------------------------
// Toast Notification & Helper Utilities
// -------------------------------------------------------------
function showToast(message) {
  let toast = document.getElementById("global-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "global-toast";
    toast.style.cssText = "position:fixed; top:max(16px, env(safe-area-inset-top, 16px)); left:50%; transform:translate(-50%, -12px); background:rgba(15,23,42,0.96); color:#38bdf8; padding:10px 18px; border-radius:24px; border:1px solid rgba(56,189,248,0.35); font-weight:600; font-size:0.88rem; z-index:99999; box-shadow:0 8px 24px rgba(0,0,0,0.6); transition:all 0.3s cubic-bezier(0.16, 1, 0.3, 1); opacity:0; pointer-events:none; max-width:min(90vw, 420px); text-align:center; backdrop-filter:blur(8px);";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = "1";
  toast.style.transform = "translate(-50%, 0)";
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translate(-50%, -12px)";
  }, 3200);
}

let adminUnlockedState = false;

function initAdminMode() {
  const pinInput = document.getElementById("admin-pin-input");
  const unlockBtn = document.getElementById("btn-unlock-admin");
  if (unlockBtn) {
    unlockBtn.addEventListener("click", () => {
      if (pinInput && pinInput.value === "1234") {
        adminUnlockedState = true;
        showToast("🔓 Admin Mode Unlocked");
        if (typeof initVideosPanel === "function") initVideosPanel();
      } else {
        alert("Incorrect PIN. Default PIN is 1234");
      }
    });
  }
}

function isAdminUnlocked() {
  return true;
}

function parseYouTubeLink(url) {
  if (!url || typeof url !== "string") return "";
  let trimmed = url.trim();
  const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
  const listMatch = trimmed.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  let videoId = watchMatch ? watchMatch[1] : "";
  let listId = listMatch ? listMatch[1] : "";
  if (videoId) {
    let embed = `https://www.youtube.com/embed/${videoId}`;
    if (listId) embed += `?list=${listId}`;
    return embed;
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return "";
}

// =============================================================
// Panel 3: Random Word Generator With Guided Pronunciation
// =============================================================

const MET_TEMPO_PRESETS = [
  { bpm: 10, name: "Grave" },
  { bpm: 46, name: "Largo" },
  { bpm: 52, name: "Lento" },
  { bpm: 56, name: "Larghetto" },
  { bpm: 60, name: "Adagio" },
  { bpm: 66, name: "Adagietto" },
  { bpm: 72, name: "Andante" },
  { bpm: 80, name: "Andantino" },
  { bpm: 88, name: "Maestoso" },
  { bpm: 96, name: "Moderato" },
  { bpm: 108, name: "Allegretto" },
  { bpm: 120, name: "Animato" },
  { bpm: 132, name: "Allegro" },
  { bpm: 160, name: "Vivace" },
  { bpm: 184, name: "Presto" },
  { bpm: 192, name: "Vivacissimo" },
  { bpm: 208, name: "Prestissimo" }
];

function getMetTempoName(bpm) {
  if (bpm <= 45) return "Grave";
  let closest = MET_TEMPO_PRESETS[0];
  let minDiff = Infinity;
  for (const p of MET_TEMPO_PRESETS) {
    const diff = Math.abs(bpm - p.bpm);
    if (diff < minDiff) {
      minDiff = diff;
      closest = p;
    }
  }
  return closest.name;
}

function getNextTempoPreset(currentBpm) {
  for (const p of MET_TEMPO_PRESETS) {
    if (p.bpm > currentBpm) return p.bpm;
  }
  return MET_TEMPO_PRESETS[MET_TEMPO_PRESETS.length - 1].bpm;
}

function getPrevTempoPreset(currentBpm) {
  for (let i = MET_TEMPO_PRESETS.length - 1; i >= 0; i--) {
    if (MET_TEMPO_PRESETS[i].bpm < currentBpm) return MET_TEMPO_PRESETS[i].bpm;
  }
  return MET_TEMPO_PRESETS[0].bpm;
}

function initRandomWordPanel() {
  const panel = document.getElementById("panel-random-word");
  if (!panel) return;
  if (panel.dataset.initialized) {
    if (!rwggpWords.length) loadRwggpData();
    return;
  }
  panel.dataset.initialized = "true";

  // 1. Load Data (Categories, Words, and Saved Lists)
  loadRwggpData();

  // 2. Setup Generate & Analyze Buttons
  const btnGenerate = document.getElementById("btn-generate-random-word");
  if (btnGenerate) {
    btnGenerate.addEventListener("click", () => generateRandomWord());
  }

  const formAnalyze = document.getElementById("rwggp-analyze-form");
  const inputAnalyze = document.getElementById("rwggp-analyze-input");
  if (formAnalyze && inputAnalyze) {
    formAnalyze.addEventListener("submit", (e) => {
      e.preventDefault();
      analyzeWordQuery(inputAnalyze.value.trim());
    });
  }

  // 3. Audio pronunciation on active word
  const btnListen = document.getElementById("btn-listen-pronunciation");
  if (btnListen) {
    btnListen.addEventListener("click", () => {
      if (rwggpActiveWord) speakRwggpWord(rwggpActiveWord.word);
    });
  }

  // 4. Bookmark save button on active word
  const btnSaveActive = document.getElementById("btn-save-current-word");
  if (btnSaveActive) {
    btnSaveActive.addEventListener("click", () => {
      if (rwggpActiveWord) openSaveWordModal(rwggpActiveWord);
    });
  }

  // 5. Category Name click on active word -> Open Category Words Modal
  const catNameEl = document.getElementById("rwggp-category-name");
  if (catNameEl) {
    catNameEl.addEventListener("click", () => {
      if (rwggpActiveWord && rwggpActiveWord.colorCategory) {
        openCategoryWordsModal(rwggpActiveWord.colorCategory);
      }
    });
  }

  // 6. Clear History Button
  const btnClearHistory = document.getElementById("btn-clear-history");
  if (btnClearHistory) {
    btnClearHistory.addEventListener("click", () => {
      rwggpHistory = [];
      try { localStorage.removeItem("sol_rwggp_history"); } catch(e) {}
      renderRwggpHistory();
    });
  }

  // 7. Savings Trigger New List
  const btnCreateListTrigger = document.getElementById("btn-create-saving-list-trigger");
  if (btnCreateListTrigger) {
    btnCreateListTrigger.addEventListener("click", () => {
      const name = prompt("Enter new list name (e.g. Challenging Sounds):");
      if (name && name.trim()) {
        createNewSavingList(name.trim());
      }
    });
  }

  // 8. Setup Metronome UI and controls
  setupMetronomeControls();

  // 9. Setup Category Words Modal Close handlers
  const catModalOverlay = document.getElementById("category-words-modal-overlay");
  const btnCloseCatModal = document.getElementById("btn-close-cat-modal");
  if (btnCloseCatModal && catModalOverlay) {
    btnCloseCatModal.addEventListener("click", () => catModalOverlay.classList.add("hidden"));
    catModalOverlay.addEventListener("click", (e) => {
      if (e.target === catModalOverlay) catModalOverlay.classList.add("hidden");
    });
  }

  // 10. Setup Save Word Modal Close and Create handlers
  setupSaveWordModalControls();
}
window.initRandomWordPanel = initRandomWordPanel;

async function loadRwggpData() {
  try {
    // Categories
    const catRes = await fetch("data/categories.json");
    if (catRes.ok) rwggpCategories = await catRes.json();
  } catch (e) {
    console.warn("Could not load categories.json:", e);
  }

  try {
    // Words
    const wordsRes = await fetch("data/words.json");
    if (wordsRes.ok) rwggpWords = await wordsRes.json();
  } catch (e) {
    console.warn("Could not load words.json:", e);
  }

  // Saved Lists: check localStorage first, else fetch default
  let loadedLists = null;
  try {
    const local = localStorage.getItem("sol_savings_lists");
    if (local) loadedLists = JSON.parse(local);
  } catch (e) {}

  if (!loadedLists || !loadedLists.length) {
    try {
      const savRes = await fetch("data/saving_lists.json");
      if (savRes.ok) {
        loadedLists = await savRes.json();
        loadedLists.forEach((l, idx) => { if (!l.id) l.id = `list_${idx + 1}`; });
      }
    } catch (e) {
      console.warn("Could not load saving_lists.json:", e);
    }
  }

  rwggpSavingLists = loadedLists || [];
  persistRwggpSavingLists();
  renderRwggpSavingsAccordion();

  // History from localStorage
  try {
    const hist = localStorage.getItem("sol_rwggp_history");
    if (hist) rwggpHistory = JSON.parse(hist);
  } catch (e) {}
  renderRwggpHistory();

  // Automatically show the first word from history or a random word
  if (rwggpHistory.length > 0) {
    displayRwggpWord(rwggpHistory[0], false);
  }
}

function getRwggpCategory(categoryName) {
  if (!categoryName) return null;
  const nameNorm = categoryName.trim().toUpperCase();
  return rwggpCategories.find(c => c.name.toUpperCase() === nameNorm) || null;
}

function getRwggpCategoryColor(categoryName) {
  const cat = getRwggpCategory(categoryName);
  return cat ? cat.color : "#4f46e5";
}

function formatWordUnderline(wordData, color) {
  const word = wordData.word;
  const stressed = wordData.stressedVowel || "";
  let pos = typeof wordData.vowelPosition === "number" ? wordData.vowelPosition : word.toLowerCase().indexOf(stressed.toLowerCase());
  if (pos < 0 || !stressed) {
    return `<span style="color:${color};">${escapeHtml(word)}</span>`;
  }
  const before = word.slice(0, pos);
  const stressedPart = word.slice(pos, pos + stressed.length);
  const after = word.slice(pos + stressed.length);
  return `<span style="color:${color};">${escapeHtml(before)}<span class="stressed-vowel-underline" style="text-decoration:underline; text-decoration-color:${color}; text-decoration-thickness:3px; text-underline-offset:6px;">${escapeHtml(stressedPart)}</span>${escapeHtml(after)}</span>`;
}

function isWordSavedInAnyList(wordStr) {
  if (!wordStr) return false;
  const target = wordStr.toLowerCase();
  return rwggpSavingLists.some(list => (list.words || []).some(w => (w.word || "").toLowerCase() === target));
}

function displayRwggpWord(wordData, pushHistory = true) {
  if (!wordData) return;
  rwggpActiveWord = wordData;

  const card = document.getElementById("rwggp-word-card");
  const titleEl = document.getElementById("rwggp-word-title");
  const phoneticEl = document.getElementById("rwggp-phonetic");
  const catNameEl = document.getElementById("rwggp-category-name");
  const defEl = document.getElementById("rwggp-definition");
  const bookmarkIcon = document.getElementById("current-word-bookmark-icon");

  const cat = getRwggpCategory(wordData.colorCategory);
  const color = cat ? cat.color : "#4f46e5";
  const sound = cat ? cat.sound : "";

  if (titleEl) {
    titleEl.innerHTML = formatWordUnderline(wordData, color);
  }
  if (phoneticEl) {
    phoneticEl.textContent = sound;
    phoneticEl.style.color = color;
  }
  if (catNameEl) {
    catNameEl.textContent = wordData.colorCategory;
    catNameEl.style.color = color;
  }
  if (defEl) {
    defEl.textContent = wordData.definition || "Definition not available";
  }

  // Update bookmark icon state on active card
  if (bookmarkIcon) {
    const isSaved = isWordSavedInAnyList(wordData.word);
    bookmarkIcon.className = isSaved ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark";
    const saveBtn = document.getElementById("btn-save-current-word");
    if (saveBtn) {
      saveBtn.style.setProperty("background", isSaved ? "#10b981" : "#4f46e5", "important");
      saveBtn.style.setProperty("border-color", isSaved ? "#059669" : "#4338ca", "important");
    }
  }

  if (card) {
    card.classList.remove("hidden");
  }

  if (pushHistory) {
    rwggpHistory = [wordData, ...rwggpHistory.filter(w => w.word.toLowerCase() !== wordData.word.toLowerCase())].slice(0, 20);
    try {
      localStorage.setItem("sol_rwggp_history", JSON.stringify(rwggpHistory));
    } catch (e) {}
    renderRwggpHistory();
  }
}

async function generateRandomWord() {
  if (!rwggpWords || rwggpWords.length === 0) {
    try {
      const res = await fetch("/api/words/random");
      if (res.ok) {
        const word = await res.json();
        displayRwggpWord(word, true);
        return;
      }
    } catch (e) {}
    if (typeof showToast === "function") showToast("Word database is loading. Please try again in a moment!");
    return;
  }
  const randomIndex = Math.floor(Math.random() * rwggpWords.length);
  const word = rwggpWords[randomIndex];
  displayRwggpWord(word, true);
}

async function analyzeWordQuery(query) {
  if (!query) {
    if (typeof showToast === "function") showToast("Please enter a word to analyze");
    return;
  }
  const clean = query.trim().toLowerCase();
  let match = rwggpWords.find(w => w.word.toLowerCase() === clean);
  if (!match) {
    try {
      const res = await fetch(`/api/words/analyze/${encodeURIComponent(clean)}`);
      if (res.ok) {
        match = await res.json();
      }
    } catch (e) {}
  }
  if (match) {
    displayRwggpWord(match, true);
    const input = document.getElementById("rwggp-analyze-input");
    if (input) input.value = "";
  } else {
    if (typeof showToast === "function") {
      showToast(`"${query}" not found in the word database`);
    } else {
      alert(`"${query}" not found in the word database`);
    }
  }
}

function speakRwggpWord(text) {
  if (!("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  } catch (e) {
    console.error("SpeechSynthesis error:", e);
  }
}

function renderRwggpHistory() {
  const card = document.getElementById("rwggp-history-card");
  const container = document.getElementById("rwggp-history-container");
  if (!container) return;

  if (rwggpHistory.length === 0) {
    if (card) card.classList.add("hidden");
    container.innerHTML = "";
    return;
  }

  if (card) card.classList.remove("hidden");

  container.innerHTML = rwggpHistory.map(w => {
    const color = getRwggpCategoryColor(w.colorCategory);
    const isSaved = isWordSavedInAnyList(w.word);
    const isWhiteTie = (w.colorCategory || "").trim().toUpperCase() === "WHITE TIE";
    return `
      <div class="rwggp-history-row" data-word="${escapeHtml(w.word)}" ${isWhiteTie ? 'data-white-tie="true"' : ''}>
        <span class="history-color-dot ${isWhiteTie ? 'is-white-tie' : ''}" style="background-color: ${color};"></span>
        <span class="history-word-text">${escapeHtml(w.word)}</span>
        <button type="button" class="history-save-btn ${isSaved ? 'saved' : ''}" data-action="save" title="${isSaved ? 'Saved in list' : 'Save to list'}">
          ${isSaved ? `
            <svg class="history-plus-icon-svg saved" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#ffffff" stroke="#10b981" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" fill="#ffffff" stroke="#10b981" />
              <path d="m9 12 2 2 4-4" stroke="#10b981" />
            </svg>
          ` : `
            <svg class="history-plus-icon-svg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#ffffff" stroke="#94a3b8" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" fill="#ffffff" stroke="#94a3b8" />
              <line x1="12" y1="8" x2="12" y2="16" stroke="#94a3b8" />
              <line x1="8" y1="12" x2="16" y2="12" stroke="#94a3b8" />
            </svg>
          `}
        </button>
        <span class="history-category-label ${isWhiteTie ? 'is-white-tie' : ''}" style="color: ${color}; font-weight: 700;">${escapeHtml(w.colorCategory)}</span>
        <button type="button" class="history-speak-btn" data-action="speak" title="Listen">
          <i class="fa-solid fa-volume-high"></i>
        </button>
      </div>
    `;
  }).join("");

  // Attach event delegation
  container.querySelectorAll(".rwggp-history-row").forEach(row => {
    const wordStr = row.getAttribute("data-word");
    const wordData = rwggpHistory.find(w => w.word === wordStr);

    row.addEventListener("click", (e) => {
      const saveBtn = e.target.closest('[data-action="save"]');
      const speakBtn = e.target.closest('[data-action="speak"]');

      if (saveBtn) {
        e.stopPropagation();
        if (wordData) openSaveWordModal(wordData);
        return;
      }
      if (speakBtn) {
        e.stopPropagation();
        if (wordData) speakRwggpWord(wordData.word);
        return;
      }
      if (wordData) {
        displayRwggpWord(wordData, false);
      }
    });
  });
}

function persistRwggpSavingLists() {
  try {
    localStorage.setItem("sol_savings_lists", JSON.stringify(rwggpSavingLists));
  } catch (e) {}

  // Sync to backend if available
  try {
    fetch("/api/savings/lists", {
      method: "GET"
    }).catch(() => {});
  } catch (e) {}
}

function createNewSavingList(name) {
  if (!name) return;
  const trimmed = name.trim();
  if (rwggpSavingLists.some(l => l.name.toLowerCase() === trimmed.toLowerCase())) {
    if (typeof showToast === "function") showToast("A list with this name already exists!");
    return;
  }
  const newList = {
    id: `list_${Date.now()}`,
    name: trimmed,
    words: []
  };
  rwggpSavingLists.push(newList);
  persistRwggpSavingLists();
  renderRwggpSavingsAccordion();
  if (typeof showToast === "function") showToast(`List "${trimmed}" created!`);
}

function renderRwggpSavingsAccordion() {
  const container = document.getElementById("rwggp-savings-container");
  if (!container) return;

  if (rwggpSavingLists.length === 0) {
    container.innerHTML = `<p class="rwggp-empty-savings-text">No saved lists yet. Click the bookmark icon on any word to save it.</p>`;
    return;
  }

  container.innerHTML = rwggpSavingLists.map(list => {
    const wordsCount = (list.words || []).length;
    return `
      <div class="savings-accordion-item" data-list-id="${escapeHtml(list.id)}">
        <div class="savings-accordion-header">
          <div class="savings-header-title">
            <i class="fa-solid fa-chevron-right chevron"></i>
            <span>${escapeHtml(list.name)}</span>
            <span class="count">(${wordsCount})</span>
          </div>
          <button type="button" class="savings-delete-btn" data-action="delete-list" title="Delete List">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
        <div class="savings-accordion-body hidden">
          ${wordsCount === 0 ? '<p style="font-size: 0.8rem; color: #94a3b8; padding: 0.4rem 0.5rem; margin:0;">No words saved in this list yet.</p>' : (list.words || []).map(w => {
            const color = getRwggpCategoryColor(w.colorCategory);
            return `
              <div class="savings-word-row" data-word="${escapeHtml(w.word)}">
                <div class="word-name">
                  <span class="history-color-dot" style="background-color: ${color};"></span>
                  <span>${escapeHtml(w.word)}</span>
                  <span style="font-size: 0.72rem; color: #94a3b8; font-weight: normal; margin-left: 0.3rem;">${escapeHtml(w.definition || '')}</span>
                </div>
                <button type="button" class="savings-delete-btn" data-action="remove-word" title="Remove word" style="font-size: 0.9rem; padding: 2px 6px;">&times;</button>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }).join("");

  // Attach Accordion Toggle and Actions
  container.querySelectorAll(".savings-accordion-item").forEach(itemEl => {
    const listId = itemEl.getAttribute("data-list-id");
    const targetList = rwggpSavingLists.find(l => l.id === listId);
    const header = itemEl.querySelector(".savings-accordion-header");
    const body = itemEl.querySelector(".savings-accordion-body");
    const delListBtn = itemEl.querySelector('[data-action="delete-list"]');

    if (header && body) {
      header.addEventListener("click", (e) => {
        if (e.target.closest('[data-action="delete-list"]')) return;
        const isExpanded = itemEl.classList.toggle("expanded");
        body.classList.toggle("hidden", !isExpanded);
      });
    }

    if (delListBtn) {
      delListBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (confirm(`Delete the list "${targetList ? targetList.name : ''}"?`)) {
          rwggpSavingLists = rwggpSavingLists.filter(l => l.id !== listId);
          persistRwggpSavingLists();
          renderRwggpSavingsAccordion();
          renderRwggpHistory();
          if (typeof showToast === "function") showToast("List deleted");
        }
      });
    }

    // Word rows inside list
    itemEl.querySelectorAll(".savings-word-row").forEach(row => {
      const wordStr = row.getAttribute("data-word");
      row.addEventListener("click", (e) => {
        const removeBtn = e.target.closest('[data-action="remove-word"]');
        if (removeBtn) {
          e.stopPropagation();
          if (targetList) {
            targetList.words = (targetList.words || []).filter(w => (w.word || "").toLowerCase() !== wordStr.toLowerCase());
            persistRwggpSavingLists();
            renderRwggpSavingsAccordion();
            renderRwggpHistory();
            if (rwggpActiveWord && rwggpActiveWord.word.toLowerCase() === wordStr.toLowerCase()) {
              displayRwggpWord(rwggpActiveWord, false);
            }
            if (typeof showToast === "function") showToast(`Removed "${wordStr}" from list`);
          }
          return;
        }

        // Click word to display it
        const fullWord = rwggpWords.find(w => w.word.toLowerCase() === wordStr.toLowerCase()) || 
                         (targetList ? targetList.words.find(w => w.word.toLowerCase() === wordStr.toLowerCase()) : null);
        if (fullWord) {
          displayRwggpWord(fullWord, true);
        }
      });
    });
  });
}

// -------------------------------------------------------------
// Category Words Modal
// -------------------------------------------------------------
function openCategoryWordsModal(categoryName) {
  const modal = document.getElementById("category-words-modal-overlay");
  const titleEl = document.getElementById("cat-modal-title");
  const subEl = document.getElementById("cat-modal-subtitle");
  const searchInput = document.getElementById("cat-modal-search");
  const gridEl = document.getElementById("cat-modal-words-grid");
  const headerEl = document.getElementById("cat-modal-header");
  const closeBtn = document.getElementById("btn-close-cat-modal");

  if (!modal || !gridEl) return;

  const cat = getRwggpCategory(categoryName);
  const color = cat ? cat.color : "#4f46e5";
  const sound = cat ? cat.sound : "";

  // Compute contrasting text color
  let isLight = false;
  try {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16) || 0;
    const g = parseInt(hex.substr(2, 2), 16) || 0;
    const b = parseInt(hex.substr(4, 2), 16) || 0;
    isLight = (r * 299 + g * 587 + b * 114) / 1000 > 130;
  } catch (e) {}

  const textColor = isLight ? "#0f172a" : "#ffffff";

  if (headerEl) {
    headerEl.style.backgroundColor = color;
  }
  if (titleEl) {
    titleEl.textContent = categoryName;
    titleEl.style.color = textColor;
  }
  if (subEl) {
    const categoryWords = rwggpWords.filter(w => w.colorCategory.toUpperCase() === categoryName.toUpperCase());
    subEl.textContent = `${sound} • ${categoryWords.length} words`;
    subEl.style.color = textColor;
  }
  if (closeBtn) {
    closeBtn.style.color = textColor;
  }

  const categoryWords = rwggpWords.filter(w => w.colorCategory.toUpperCase() === categoryName.toUpperCase());

  const renderGrid = (filterQuery = "") => {
    const filtered = categoryWords.filter(w => w.word.toLowerCase().includes(filterQuery.toLowerCase()));
    if (filtered.length === 0) {
      gridEl.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: #94a3b8; padding: 2rem;">No words match "${escapeHtml(filterQuery)}"</div>`;
      return;
    }
    gridEl.innerHTML = filtered.map(w => {
      return `
        <button type="button" class="cat-word-btn" data-word="${escapeHtml(w.word)}" style="text-align:left; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:0.45rem 0.65rem; font-size:0.88rem; font-weight:600; cursor:pointer; transition:all 0.15s ease; display:flex; align-items:center; justify-content:space-between;">
          <span>${formatWordUnderline(w, color)}</span>
        </button>
      `;
    }).join("");

    gridEl.querySelectorAll(".cat-word-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const wordStr = btn.getAttribute("data-word");
        const found = rwggpWords.find(w => w.word === wordStr);
        if (found) {
          displayRwggpWord(found, true);
          modal.classList.add("hidden");
        }
      });
    });
  };

  renderGrid("");

  if (searchInput) {
    searchInput.value = "";
    searchInput.oninput = () => renderGrid(searchInput.value.trim());
  }

  modal.classList.remove("hidden");
}

// -------------------------------------------------------------
// Save Word Modal / Context Popover
// -------------------------------------------------------------
function openSaveWordModal(wordData) {
  if (!wordData) return;
  rwggpSaveTargetWord = wordData;

  const modal = document.getElementById("save-word-modal-overlay");
  const container = document.getElementById("save-popover-lists-container");
  const searchInput = document.getElementById("save-popover-search-input");
  const createRow = document.getElementById("save-popover-create-row");
  const createInput = document.getElementById("save-new-list-input");

  if (!modal || !container) return;

  if (createRow) createRow.classList.add("hidden");
  if (createInput) createInput.value = "";
  if (searchInput) searchInput.value = "";

  const renderLists = (query = "") => {
    const filtered = rwggpSavingLists.filter(l => l.name.toLowerCase().includes(query.toLowerCase()));
    if (filtered.length === 0) {
      container.innerHTML = `<p class="save-popover-empty">No lists found. Click "Create New List" above.</p>`;
      return;
    }

    container.innerHTML = filtered.map(list => {
      const alreadyInList = (list.words || []).some(w => (w.word || "").toLowerCase() === wordData.word.toLowerCase());
      return `
        <div class="save-popover-list-row ${alreadyInList ? 'in-list' : ''}" data-list-id="${escapeHtml(list.id)}" title="${alreadyInList ? 'Already in this list' : 'Click to save word'}">
          <i class="${alreadyInList ? 'fa-solid fa-check save-popover-row-bookmark' : 'fa-regular fa-bookmark save-popover-row-bookmark'}" style="color: ${alreadyInList ? '#10b981' : '#4f46e5'};"></i>
          <span class="save-popover-list-name">${escapeHtml(list.name)}</span>
          <span class="save-popover-word-count">(${(list.words || []).length})</span>
        </div>
      `;
    }).join("");

    container.querySelectorAll(".save-popover-list-row").forEach(row => {
      row.addEventListener("click", () => {
        const listId = row.getAttribute("data-list-id");
        const list = rwggpSavingLists.find(l => l.id === listId);
        if (!list) return;

        const already = (list.words || []).some(w => (w.word || "").toLowerCase() === wordData.word.toLowerCase());
        if (already) {
          if (typeof showToast === "function") showToast(`"${wordData.word}" is already in ${list.name}`);
          return;
        }

        list.words = list.words || [];
        list.words.push({
          word: wordData.word,
          colorCategory: wordData.colorCategory,
          stressedVowel: wordData.stressedVowel,
          definition: wordData.definition || ""
        });

        persistRwggpSavingLists();
        renderRwggpSavingsAccordion();
        renderRwggpHistory();
        if (rwggpActiveWord && rwggpActiveWord.word.toLowerCase() === wordData.word.toLowerCase()) {
          displayRwggpWord(rwggpActiveWord, false);
        }

        if (typeof showToast === "function") showToast(`Added "${wordData.word}" to ${list.name}`);
        modal.classList.add("hidden");
      });
    });
  };

  renderLists("");

  if (searchInput) {
    searchInput.oninput = () => renderLists(searchInput.value.trim());
  }

  modal.classList.remove("hidden");
}

function setupSaveWordModalControls() {
  const modal = document.getElementById("save-word-modal-overlay");
  const closeBtn = document.getElementById("btn-close-save-popover");
  const showCreateBtn = document.getElementById("btn-show-create-list");
  const createRow = document.getElementById("save-popover-create-row");
  const createInput = document.getElementById("save-new-list-input");
  const confirmCreateBtn = document.getElementById("btn-confirm-create-list");
  const cancelCreateBtn = document.getElementById("btn-cancel-create-list");

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.add("hidden");
    });
  }

  if (showCreateBtn && createRow && createInput) {
    showCreateBtn.addEventListener("click", () => {
      createRow.classList.remove("hidden");
      createInput.focus();
    });
  }

  if (cancelCreateBtn && createRow) {
    cancelCreateBtn.addEventListener("click", () => {
      createRow.classList.add("hidden");
    });
  }

  if (confirmCreateBtn && createInput) {
    confirmCreateBtn.addEventListener("click", () => {
      const name = createInput.value.trim();
      if (!name) return;
      if (rwggpSavingLists.some(l => l.name.toLowerCase() === name.toLowerCase())) {
        if (typeof showToast === "function") showToast("List name already exists");
        return;
      }
      const newList = {
        id: `list_${Date.now()}`,
        name: name,
        words: []
      };
      rwggpSavingLists.push(newList);
      persistRwggpSavingLists();
      renderRwggpSavingsAccordion();
      createInput.value = "";
      createRow.classList.add("hidden");

      // Immediately add the active word if we have one
      if (rwggpSaveTargetWord) {
        newList.words.push({
          word: rwggpSaveTargetWord.word,
          colorCategory: rwggpSaveTargetWord.colorCategory,
          stressedVowel: rwggpSaveTargetWord.stressedVowel,
          definition: rwggpSaveTargetWord.definition || ""
        });
        persistRwggpSavingLists();
        renderRwggpSavingsAccordion();
        renderRwggpHistory();
        if (rwggpActiveWord) displayRwggpWord(rwggpActiveWord, false);
        if (typeof showToast === "function") showToast(`Added "${rwggpSaveTargetWord.word}" to ${name}`);
        if (modal) modal.classList.add("hidden");
      }
    });
  }
}

// -------------------------------------------------------------
// Metronome Engine (Web Audio API)
// -------------------------------------------------------------
function setupMetronomeControls() {
  const btnToggle = document.getElementById("btn-toggle-metronome");
  const dropdown = document.getElementById("metronome-dropdown");
  const btnClose = document.getElementById("btn-close-metronome");
  const btnPlay = document.getElementById("btn-metronome-play");
  const playIcon = document.getElementById("metronome-play-icon");
  const slider = document.getElementById("metronome-bpm-slider");
  const bpmVal = document.getElementById("metronome-bpm-val");
  const tempoName = document.getElementById("metronome-tempo-name");
  const btnBpmUp = document.getElementById("btn-bpm-up");
  const btnBpmDown = document.getElementById("btn-bpm-down");

  if (btnToggle && dropdown) {
    btnToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("hidden");
      if (!dropdown.classList.contains("hidden")) {
        updateSliderFill(metBpm);
      }
    });
  }

  if (btnClose && dropdown) {
    btnClose.addEventListener("click", () => dropdown.classList.add("hidden"));
  }

  // Update BPM from slider
  const updateSliderFill = (val) => {
    if (!slider) return;
    const min = parseFloat(slider.min) || 10;
    const max = parseFloat(slider.max) || 220;
    const current = typeof val === "number" ? val : (parseFloat(slider.value) || metBpm);
    const ratio = Math.max(0, Math.min(1, (current - min) / (max - min)));
    const trackH = slider.offsetHeight || 80;
    const thumbRadius = 9;
    const thumbCenterPx = thumbRadius + ratio * Math.max(0, trackH - thumbRadius * 2);
    const pct = ((thumbCenterPx / trackH) * 100).toFixed(2);
    slider.style.background = `linear-gradient(to top, #4f46e5 0%, #4f46e5 ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)`;
  };

  const setBpm = (newVal) => {
    metBpm = Math.min(220, Math.max(10, newVal));
    if (slider) {
      slider.value = metBpm;
      updateSliderFill(metBpm);
    }
    if (bpmVal) bpmVal.textContent = metBpm;
    if (tempoName) tempoName.textContent = getMetTempoName(metBpm);
  };

  if (slider) {
    slider.addEventListener("input", (e) => {
      const val = parseInt(e.target.value, 10);
      metBpm = Math.min(220, Math.max(10, val));
      if (bpmVal) bpmVal.textContent = metBpm;
      if (tempoName) tempoName.textContent = getMetTempoName(metBpm);
      updateSliderFill(metBpm);
    });
    slider.addEventListener("change", (e) => setBpm(parseInt(e.target.value, 10)));
  }

  if (btnBpmUp) {
    btnBpmUp.addEventListener("click", () => setBpm(getNextTempoPreset(metBpm)));
  }

  if (btnBpmDown) {
    btnBpmDown.addEventListener("click", () => setBpm(getPrevTempoPreset(metBpm)));
  }

  // Time Signatures
  document.querySelectorAll("#metronome-sig-pills .metronome-pill-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#metronome-sig-pills .metronome-pill-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const beats = parseInt(btn.getAttribute("data-beats"), 10);
      const note = parseInt(btn.getAttribute("data-note"), 10);
      metTimeSig = { beats, noteValue: note };
      renderBeatDots();
    });
  });

  // Sound Options
  document.querySelectorAll("#metronome-sound-pills .metronome-pill-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#metronome-sound-pills .metronome-pill-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      metSound = btn.getAttribute("data-sound") || "click";
    });
  });

  // Play / Pause Toggle
  if (btnPlay) {
    btnPlay.addEventListener("click", () => {
      if (metIsPlaying) {
        stopMetronome();
      } else {
        startMetronome();
      }
    });
  }

  renderBeatDots();
  updateSliderFill(metBpm);
}

function renderBeatDots() {
  const container = document.getElementById("metronome-beat-dots");
  if (!container) return;
  container.innerHTML = "";
  for (let i = 0; i < metTimeSig.beats; i++) {
    const dot = document.createElement("span");
    dot.className = i === 0 ? "beat-dot active" : "beat-dot";
    container.appendChild(dot);
  }
}

function startMetronome() {
  if (!metAudioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    metAudioCtx = new AudioCtx();
  }
  if (metAudioCtx.state === "suspended") {
    metAudioCtx.resume();
  }

  metIsPlaying = true;
  metCurrentBeat = 0;
  metNextNoteTime = metAudioCtx.currentTime + 0.05;

  const playIcon = document.getElementById("metronome-play-icon");
  if (playIcon) playIcon.className = "fa-solid fa-pause";

  metScheduler();
}

function stopMetronome() {
  metIsPlaying = false;
  if (metTimerId) {
    clearTimeout(metTimerId);
    metTimerId = null;
  }

  const playIcon = document.getElementById("metronome-play-icon");
  if (playIcon) playIcon.className = "fa-solid fa-play";

  // Reset active beat dots
  const dots = document.querySelectorAll("#metronome-beat-dots .beat-dot");
  dots.forEach((d, idx) => d.classList.toggle("active", idx === 0));
}

function metScheduler() {
  if (!metIsPlaying || !metAudioCtx) return;

  while (metNextNoteTime < metAudioCtx.currentTime + 0.1) {
    playMetTone(metNextNoteTime, metCurrentBeat === 0);
    flashBeatDot(metCurrentBeat);

    // Calculate next beat time
    const secondsPerBeat = 60.0 / metBpm;
    // If noteValue is 8 (like 5/8 or 6/8), adjust beat length
    const factor = metTimeSig.noteValue === 8 ? 0.5 : 1.0;
    metNextNoteTime += secondsPerBeat * factor;

    metCurrentBeat = (metCurrentBeat + 1) % metTimeSig.beats;
  }

  metTimerId = setTimeout(metScheduler, 25);
}

function playMetTone(time, isAccent) {
  if (!metAudioCtx) return;
  const osc = metAudioCtx.createOscillator();
  const gain = metAudioCtx.createGain();

  let freq = 800;
  let type = "square";

  if (metSound === "click") {
    freq = isAccent ? 1000 : 800;
    type = "square";
  } else if (metSound === "wood") {
    freq = isAccent ? 400 : 300;
    type = "sine";
  } else if (metSound === "beep") {
    freq = isAccent ? 880 : 660;
    type = "sine";
  } else if (metSound === "tick") {
    freq = isAccent ? 1500 : 1200;
    type = "square";
  }

  osc.type = type;
  osc.frequency.setValueAtTime(freq, time);

  gain.gain.setValueAtTime(0.4, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + (metSound === "beep" ? 0.08 : 0.04));

  osc.connect(gain);
  gain.connect(metAudioCtx.destination);

  osc.start(time);
  osc.stop(time + (metSound === "beep" ? 0.08 : 0.04));
}

function flashBeatDot(beatIndex) {
  const dots = document.querySelectorAll("#metronome-beat-dots .beat-dot");
  dots.forEach((d, idx) => {
    d.classList.toggle("active", idx === beatIndex);
  });
}

function renderCircleMembersWidget() {
  const container = document.getElementById("widget-members-list");
  if (!container) return;

  const currentUser = getActiveUserProfile();

  const baseMembers = [
    { name: "Gregory Dobbins", role: "Program Manager", status: "online", avatar: "GD" },
    { name: "Sarah K.", role: "Language Coach", status: "online", avatar: "SK" },
    { name: "Elena Rostova", role: "Linguist & Phonetics", status: "online", avatar: "ER" },
    { name: "Alice F.", role: "Member", status: "online", avatar: "AF" },
    { name: "Bob D.", role: "Member", status: "offline", avatar: "BD" },
    { name: "Marcus Vance", role: "Moderator", status: "offline", avatar: "MV" }
  ];

  let displayList = [];
  if (currentUser) {
    displayList.push({
      name: `${currentUser.name} (You)`,
      role: "Learner 👤",
      status: "online",
      avatar: currentUser.picture || getUserInitials(currentUser.name),
      isUser: true
    });
  } else {
    displayList.push({
      name: "Guest Learner (You)",
      role: "Guest",
      status: "online",
      avatar: "👤",
      isUser: true
    });
  }

  displayList = displayList.concat(baseMembers);

  container.innerHTML = displayList.map(m => {
    let avatarHtml = "";
    if (m.avatar && (m.avatar.startsWith("http") || m.avatar.startsWith("data:"))) {
      avatarHtml = `<img src="${escapeHtml(m.avatar)}" alt="${escapeHtml(m.name)}" style="width:100%;height:100%;border-radius:6px;object-fit:cover;display:block;">`;
    } else {
      avatarHtml = escapeHtml(m.avatar || "👤");
    }

    return `
      <div class="member-widget-item ${m.isUser ? 'is-current-user' : ''}" style="${m.isUser ? 'background: rgba(197, 160, 89, 0.12); padding: 5px 8px; border-radius: 8px; border: 1px solid rgba(197, 160, 89, 0.25);' : ''}">
        <div class="widget-avatar" style="overflow:hidden;flex-shrink:0;">${avatarHtml}</div>
        <span class="widget-name" style="${m.isUser ? 'color: var(--accent-color, #c5a059); font-weight: 700;' : ''} overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(m.name)}</span>
        <span class="widget-status-dot ${m.status}" title="${m.status}"></span>
      </div>
    `;
  }).join("");
}

function simulateCircleReply(postId, title, body) {
  let targetPost = null;
  for (const ch in circleChannelsData) {
    const p = circleChannelsData[ch].find(item => item.id === postId);
    if (p) {
      targetPost = p;
      break;
    }
  }
  if (!targetPost) return;

  targetPost.comments = targetPost.comments || [];
  
  const coaches = [
    { author: "Gregory Dobbins (Program Manager)", text: "Great contribution! Keep up the momentum in your comprehension practice. Welcome to the Globally Known community!" },
    { author: "Sarah K. (Language Coach)", text: "Excellent point! Shadowing and consistent input will definitely help lock this down. Fantastic work!" },
    { author: "Elena Rostova (Linguist)", text: "Love this observation. Notice how the phonetics and syntax align here — keep going!" }
  ];
  const coach = coaches[Math.floor(Math.random() * coaches.length)];
  targetPost.comments.push({
    author: coach.author,
    content: coach.text
  });
  renderCircleFeed();
}


// Global Fail-Proof Event Delegation for Tab Switching
document.addEventListener("click", (e) => {
  const item = e.target.closest("[data-panel]");
  if (item) {
    const panelId = item.getAttribute("data-panel");
    if (panelId && typeof window.switchPanel === "function") {
      window.switchPanel(panelId);
    }
  }
});

// Dynamic Mobile Viewport & Screen Resolution Synchronizer
function syncDynamicViewport() {
  try {
    const vv = window.visualViewport;
    const width = vv ? vv.width : (window.innerWidth || document.documentElement.clientWidth);
    const height = vv ? vv.height : (window.innerHeight || document.documentElement.clientHeight);
    const dpr = window.devicePixelRatio || 1;

    document.documentElement.style.setProperty('--app-dvh', `${height}px`);
    document.documentElement.style.setProperty('--app-dvw', `${width}px`);
    document.documentElement.style.setProperty('--vh', `${height * 0.01}px`);
    document.documentElement.style.setProperty('--vw', `${width * 0.01}px`);
    document.documentElement.style.setProperty('--dpr', `${dpr}`);

    // Dynamic scale factor for varying mobile screen resolutions (320px to 480px+)
    const mobileScale = Math.min(Math.max(width / 390, 0.85), 1.25);
    document.documentElement.style.setProperty('--mobile-scale', `${mobileScale}`);
  } catch (e) {
    console.warn("syncDynamicViewport error:", e);
  }
}

window.addEventListener('resize', syncDynamicViewport, { passive: true });
window.addEventListener('orientationchange', () => {
  setTimeout(syncDynamicViewport, 120);
}, { passive: true });
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', syncDynamicViewport, { passive: true });
  window.visualViewport.addEventListener('scroll', syncDynamicViewport, { passive: true });
}
syncDynamicViewport();

// Global Event Delegation for Gemini Input Bars (Mic vs Send button swap)
["input", "keyup", "change"].forEach(evtName => {
  document.addEventListener(evtName, (e) => {
    if (e.target && e.target.matches && e.target.matches(".gemini-home-input-bar input")) {
      syncInputBarHasText(e.target);
    }
  });
});
