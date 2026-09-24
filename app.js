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
let activeModel = "gemini-3.6-flash";
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
    if (geminiService.apiKey) {
      if (text) text.textContent = "Gemini Active";
    } else {
      if (text) text.textContent = "Sol AI Platform";
    }
  } else {
    if (dot) dot.className = "status-dot warning";
    if (text) text.textContent = "Demo Mode";
  }
}

// Global listener for platform AI availability updates
if (typeof window !== "undefined") {
  window.addEventListener("sol_platform_status_updated", () => {
    updateApiStatusIndicator();
    if (typeof updateEngineBadgeUI === "function") {
      updateEngineBadgeUI();
    }
  });
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
  initSolCompanion();

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

function getActiveUserProfile() {
  try {
    const raw = localStorage.getItem("sol_user_profile");
    if (raw) {
      const p = JSON.parse(raw);
      if (p && (p.name || p.email)) return p;
    }
  } catch (e) {}
  return null;
}

function isGuestUser() {
  return !getActiveUserProfile();
}

function getActiveUserName() {
  const p = getActiveUserProfile();
  if (p && p.name) {
    return p.name.split(" ")[0];
  }
  return "Guest";
}

function getActiveUserStorageKey(prefix) {
  const p = getActiveUserProfile();
  if (p && p.email) {
    const cleanEmail = p.email.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
    return `${prefix}_${cleanEmail}`;
  }
  return `${prefix}_guest`;
}

function updateGreetingText() {
  const greetingEl = document.getElementById("gemini-greeting-text");
  const outputGreetingEl = document.getElementById("output-greeting-text");
  const labGreetingEl = document.getElementById("lab-greeting-text");
  
  const isGuest = isGuestUser();
  const name = getActiveUserName();

  if (outputGreetingEl) {
    outputGreetingEl.textContent = isGuest ? "Speak with Sol, Guest!" : `Speak with Sol, ${name}!`;
  }
  if (labGreetingEl) {
    labGreetingEl.textContent = isGuest ? "Describe the scene, Guest!" : `Describe the scene, ${name}!`;
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
window.updateGreetingText = updateGreetingText;
window.getActiveUserProfile = getActiveUserProfile;
window.getActiveUserName = getActiveUserName;
window.isGuestUser = isGuestUser;
window.getActiveUserStorageKey = getActiveUserStorageKey;

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
  if (typeof attachSolToLastMessage === "function") {
    attachSolToLastMessage();
  }
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

function bindSolCompanionEvents(div) {
  if (!div || div.__solBound) return;
  div.__solBound = true;

  const companionPhrases = [
    "Move me wherever you want!",
    "Hold me for 1 second to move me! 🚀",
    "I'm right here with you! ✨",
    "Watching the flow... 👁️",
    "Ask me anything! 💡",
    "I'm all ears... well, all eye! 😄",
    "Keeping you company! 🌟",
    "Got your back, always! 👊"
  ];
  let phraseIdx = -1;
  let speechTimeout = null;

  function showCompanionSpeech(text, duration = 3200) {
    const speech = div.querySelector(".sol-companion-speech-bubble");
    if (!speech) return;
    speech.textContent = text;
    div.classList.add("show-speech");
    if (speechTimeout) clearTimeout(speechTimeout);
    speechTimeout = setTimeout(() => {
      div.classList.remove("show-speech");
    }, duration);
  }

  // Drag & Hold State
  let holdTimer = null;
  let isHeld1s = false;
  let isDragging = false;
  let startX = 0, startY = 0;
  let pointerOffsetX = 0, pointerOffsetY = 0;
  let activePointerId = null;

  function clampToConversationWindow(clientX, clientY) {
    const panelChat = document.getElementById("panel-sol-chat");
    const pRect = panelChat ? panelChat.getBoundingClientRect() : {
      left: 0,
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight
    };

    const solW = div.offsetWidth || 38;
    const solH = div.offsetHeight || 59;

    const minX = pRect.left + 10;
    const maxX = pRect.right - solW - 10;
    const minY = pRect.top + 10;
    const maxY = pRect.bottom - solH - 10;

    const rawX = clientX - pointerOffsetX;
    const rawY = clientY - pointerOffsetY;

    const clampedX = Math.max(minX, Math.min(maxX, rawX));
    const clampedY = Math.max(minY, Math.min(maxY, rawY));

    div.style.left = `${clampedX}px`;
    div.style.top = `${clampedY}px`;
  }

  div.addEventListener("pointerdown", (e) => {
    if (e.button && e.button !== 0) return;

    startX = e.clientX;
    startY = e.clientY;
    isHeld1s = false;
    isDragging = false;
    activePointerId = e.pointerId;

    const rect = div.getBoundingClientRect();
    pointerOffsetX = e.clientX - rect.left;
    pointerOffsetY = e.clientY - rect.top;

    if (holdTimer) clearTimeout(holdTimer);

    // 0.4-second hold threshold to unlock free movement
    holdTimer = setTimeout(() => {
      isHeld1s = true;
      isDragging = true;
      div.setAttribute("data-custom-placed", "true");

      // Optional haptic vibration feedback on touch devices
      if (navigator.vibrate) {
        try { navigator.vibrate([60, 40, 60]); } catch (err) {}
      }

      // Detach ENTIRELY from the input wrapper so zero clone remains!
      const inputWrapper = document.getElementById("gemini-input-wrapper") || document.querySelector(".gemini-input-wrapper");
      if (inputWrapper && inputWrapper.contains(div)) {
        inputWrapper.removeChild(div);
      }

      const panelChat = document.getElementById("panel-sol-chat") || document.body;
      if (div.parentNode !== panelChat) {
        if (div.parentNode) div.parentNode.removeChild(div);
        panelChat.appendChild(div);
      }

      div.classList.add("sol-free-floating", "sol-is-held");
      clampToConversationWindow(e.clientX, e.clientY);

      try { div.setPointerCapture(e.pointerId); } catch (err) {}

      showCompanionSpeech("Move me wherever you want!", 2200);
    }, 400);
  });

  const onPointerMove = (e) => {
    if (!isHeld1s) {
      // If moved > 10px before the 0.4 second threshold, user is probably scrolling page
      const dist = Math.hypot(e.clientX - startX, e.clientY - startY);
      if (dist > 10) {
        if (holdTimer) {
          clearTimeout(holdTimer);
          holdTimer = null;
        }
      }
      return;
    }

    if (isDragging) {
      e.preventDefault();
      clampToConversationWindow(e.clientX, e.clientY);
    }
  };

  const onPointerUp = (e) => {
    if (holdTimer) {
      clearTimeout(holdTimer);
      holdTimer = null;
    }

    if (activePointerId !== null) {
      try { div.releasePointerCapture(activePointerId); } catch (err) {}
      activePointerId = null;
    }

    if (isHeld1s && isDragging) {
      isDragging = false;
      div.classList.remove("sol-is-held");

      // Check if dropped near his main position (the left side of the input bar) to snap back
      const inputWrapper = document.getElementById("gemini-input-wrapper") || document.querySelector(".gemini-input-wrapper");
      let dockedBack = false;

      if (inputWrapper) {
        const wrapRect = inputWrapper.getBoundingClientRect();
        const divRect = div.getBoundingClientRect();
        const dist = Math.hypot(divRect.left - wrapRect.left, divRect.bottom - wrapRect.bottom);
        if (dist < 110) {
          div.removeAttribute("data-custom-placed");
          div.classList.remove("sol-free-floating");
          div.style.left = "";
          div.style.top = "";
          attachSolCompanion();
          showCompanionSpeech("Back home! 🏠✨", 2200);
          dockedBack = true;
        }
      }

      if (!dockedBack) {
        showCompanionSpeech("I like it here! 💛", 2200);
      }
      return;
    }

    // Normal short tap / click without holding
    if (!isHeld1s) {
      phraseIdx = (phraseIdx + 1) % companionPhrases.length;
      showCompanionSpeech(companionPhrases[phraseIdx]);
    }
  };

  div.addEventListener("pointermove", onPointerMove);
  div.addEventListener("pointerup", onPointerUp);
  div.addEventListener("pointercancel", () => {
    if (holdTimer) {
      clearTimeout(holdTimer);
      holdTimer = null;
    }
    isDragging = false;
    div.classList.remove("sol-is-held");
  });
}

function createSolCompanionElement() {
  let div = document.getElementById("sol-last-msg-companion");
  if (div) {
    bindSolCompanionEvents(div);
    return div;
  }

  div = document.createElement("div");
  div.className = "sol-last-msg-companion";
  div.id = "sol-last-msg-companion";
  div.title = "Sol Companion";
  div.innerHTML = `
    <div class="sol-companion-speech-bubble" id="sol-companion-speech">Move me wherever you want!</div>
    
    <!-- Thinking Dots Animation: Orbital thought halo above Sol -->
    <div class="sol-thinking-indicator" id="sol-thinking-indicator" aria-hidden="true">
      <svg class="sol-thinking-svg" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <circle class="sol-think-dot std-1" cx="18" cy="4" r="1.8" />
        <circle class="sol-think-dot std-2" cx="28" cy="8" r="1.8" />
        <circle class="sol-think-dot std-3" cx="32" cy="18" r="1.8" />
        <circle class="sol-think-dot std-4" cx="28" cy="28" r="1.8" />
        <circle class="sol-think-dot std-5" cx="18" cy="32" r="1.8" />
        <circle class="sol-think-dot std-6" cx="8" cy="28" r="1.8" />
        <circle class="sol-think-dot std-7" cx="4" cy="18" r="1.8" />
        <circle class="sol-think-dot std-8" cx="8" cy="8" r="1.8" />
      </svg>
    </div>

    <svg class="sol-companion-svg" viewBox="0 0 100 155" xmlns="http://www.w3.org/2000/svg">
      <!-- 1. Top Exclamation Mark Stem -->
      <path class="sol-stem" d="M 37.6 78 L 37.6 56 C 37.6 44, 42.2 10, 50 0 C 57.8 10, 62.4 44, 62.4 56 L 62.4 78 Q 50 71 37.6 78 Z" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      
      <!-- 2. 5 Radiating Eyelash Lines -->
      <g class="sol-rays">
        <line x1="20.9" y1="101.9" x2="16.3" y2="91.9" stroke-width="4.5" stroke-linecap="round" />
        <line x1="35.0" y1="97.4" x2="32.9" y2="86.6" stroke-width="4.5" stroke-linecap="round" />
        <line x1="50.0" y1="96.0" x2="50.0" y2="85.0" stroke-width="4.5" stroke-linecap="round" />
        <line x1="65.0" y1="97.4" x2="67.1" y2="86.6" stroke-width="4.5" stroke-linecap="round" />
        <line x1="79.1" y1="101.9" x2="83.7" y2="91.9" stroke-width="4.5" stroke-linecap="round" />
      </g>
      
      <!-- 3. Outer Eye Almond Group (Eye open - STRICTLY NO BLINK) -->
      <g class="sol-eyelid-group sol-companion-eyelid">
        <!-- Almond Eye Outline -->
        <path class="sol-eye-outline" d="M 12 120 C 26 100 74 100 88 120 C 74 140 26 140 12 120 Z" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
        
        <!-- 4. Pupil & Iris Group (Smoothly looks left and right only) -->
        <g class="sol-pupil-group sol-companion-pupil">
          <!-- Iris Outer Ring Circle -->
          <circle class="sol-iris" cx="50" cy="120" r="11.5" stroke-width="4.5" fill="none" />
          
          <!-- Inner Pupil Solid Dot -->
          <circle class="sol-pupil-dot" cx="50" cy="120" r="5.8" />
          
          <!-- Pupil Reflection Highlight Dot -->
          <circle class="sol-pupil-highlight" cx="47.8" cy="117.8" r="1.8" />
        </g>
      </g>
    </svg>
  `;

  bindSolCompanionEvents(div);
  return div;
}

function attachSolCompanion() {
  const inputWrapper = document.getElementById("gemini-input-wrapper") || document.querySelector(".gemini-input-wrapper");
  const inputBar = document.querySelector(".gemini-home-input-bar");
  if (!inputWrapper || !inputBar) return;

  const conversationEl = document.getElementById("gemini-home-conversation");
  const hasMsgs = conversationEl && conversationEl.querySelectorAll(".gemini-inline-message").length > 0;

  let companion = document.getElementById("sol-last-msg-companion");

  // Keep Sol ONLY in the conversation chat box (never on the empty SOL tab landing page)
  if (!hasMsgs) {
    if (companion && !companion.classList.contains("sol-free-floating")) {
      companion.style.display = "none";
    }
    return;
  }

  if (companion) {
    companion.style.display = "flex";
  }

  // If user moved Sol to a custom spot anywhere on screen, do NOT move Sol or create any clone!
  if (companion && (companion.getAttribute("data-custom-placed") === "true" || companion.classList.contains("sol-free-floating"))) {
    return;
  }

  if (!companion) {
    companion = createSolCompanionElement();
    companion.style.display = "flex";
  } else if (!companion.__solBound) {
    bindSolCompanionEvents(companion);
  }

  // Ensure singleton - remove any duplicate companion instances (strict zero-clones guarantee)
  const allCompanions = document.querySelectorAll(".sol-last-msg-companion");
  allCompanions.forEach(c => {
    if (c !== companion && c.parentNode) {
      c.parentNode.removeChild(c);
    }
  });

  // Dock Sol on the left side of the input bar (main position)
  if (companion.parentNode !== inputWrapper || companion.nextElementSibling !== inputBar) {
    if (companion.parentNode) companion.parentNode.removeChild(companion);
    inputWrapper.insertBefore(companion, inputBar);
  }
}

function attachSolToLastMessage() {
  attachSolCompanion();
}
window.attachSolCompanion = attachSolCompanion;
window.attachSolToLastMessage = attachSolCompanion;

function initSolCompanion() {
  const companion = document.getElementById("sol-last-msg-companion");
  if (companion && !companion.__solBound) {
    bindSolCompanionEvents(companion);
  }
  attachSolCompanion();
}

function setSolThinking(isThinking) {
  const companion = document.getElementById("sol-last-msg-companion");
  if (!companion) return;
  let thinkEl = companion.querySelector(".sol-thinking-indicator");
  if (!thinkEl) {
    thinkEl = document.createElement("div");
    thinkEl.className = "sol-thinking-indicator";
    thinkEl.id = "sol-thinking-indicator";
    thinkEl.setAttribute("aria-hidden", "true");
    thinkEl.innerHTML = `
      <svg class="sol-thinking-svg" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <circle class="sol-think-dot std-1" cx="18" cy="4" r="1.8" />
        <circle class="sol-think-dot std-2" cx="28" cy="8" r="1.8" />
        <circle class="sol-think-dot std-3" cx="32" cy="18" r="1.8" />
        <circle class="sol-think-dot std-4" cx="28" cy="28" r="1.8" />
        <circle class="sol-think-dot std-5" cx="18" cy="32" r="1.8" />
        <circle class="sol-think-dot std-6" cx="8" cy="28" r="1.8" />
        <circle class="sol-think-dot std-7" cx="4" cy="18" r="1.8" />
        <circle class="sol-think-dot std-8" cx="8" cy="8" r="1.8" />
      </svg>
    `;
    companion.appendChild(thinkEl);
  }
  companion.classList.toggle("is-thinking", !!isThinking);
}
window.setSolThinking = setSolThinking;

function attachAiActions(aiDiv, text) {
  if (!aiDiv || !text || aiDiv.querySelector(".gemini-ai-actions")) return;
  const actionsDiv = document.createElement("div");
  actionsDiv.className = "gemini-ai-actions";
  actionsDiv.innerHTML = `
    <button class="gemini-action-btn tts-btn" title="Listen to pronunciation"><i class="fa-solid fa-volume-high"></i> Listen</button>
    <button class="gemini-action-btn copy-btn" title="Copy response"><i class="fa-solid fa-copy"></i> Copy</button>
    <button class="gemini-action-btn teach-btn" title="Teach Sol how you wanted this answered"><i class="fa-solid fa-graduation-cap"></i> Teach Sol</button>
  `;
  const contentCol = aiDiv.querySelector(".gemini-ai-content-col");
  if (contentCol) {
    contentCol.appendChild(actionsDiv);
  } else {
    aiDiv.appendChild(actionsDiv);
  }

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

  // Reset Sol companion back to docked position and hide him on the empty SOL tab
  const companion = document.getElementById("sol-last-msg-companion");
  if (companion) {
    companion.classList.remove("sol-free-floating", "sol-is-held", "show-speech");
    companion.removeAttribute("data-custom-placed");
    companion.style.left = "";
    companion.style.top = "";
    companion.style.display = "none";
    const inputWrapper = document.getElementById("gemini-input-wrapper");
    const inputBar = document.querySelector(".gemini-home-input-bar");
    if (inputWrapper && inputBar && companion.parentNode !== inputWrapper) {
      inputWrapper.insertBefore(companion, inputBar);
    }
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

    // 2. Activate mini Sol orbital thinking dots animation
    setSolThinking(true);

    let aiDiv = null;
    let aiBody = null;
    const ensureAiDiv = () => {
      if (!aiDiv) {
        aiDiv = document.createElement("div");
        aiDiv.className = "gemini-inline-message";
        aiDiv.innerHTML = `
          <div class="gemini-ai-row">
            <div class="gemini-ai-content-col">
              <div class="gemini-ai-response">
                <div class="gemini-ai-body"></div>
              </div>
            </div>
          </div>
        `;
        conversationEl.appendChild(aiDiv);
        aiBody = aiDiv.querySelector(".gemini-ai-body");
        if (typeof attachSolToLastMessage === "function") {
          attachSolToLastMessage();
        }
      }
      return { aiDiv, aiBody };
    };

    let responseText = "";

    const activeName = getActiveUserName();
    const isGuest = isGuestUser();
    const greetingGuidance = isGuest
      ? 'When greeted ("hi", "hey", "hello", "hi sol"), respond naturally like a friendly host welcoming someone (e.g., "Hello Guest! Great to meet you. What\'s on your mind today?" or "Hey there! How\'s your day going?"). Never call the user Adrian and do NOT assume any personal name unless they tell you.'
      : `When greeted ("hi", "hey", "hello", "hi sol"), respond naturally and warmly like a friend catching up (e.g., "Hey ${activeName}! Great to see you. How's your day going?" or "Hey there! What's on your mind today?").`;

    const systemInstruction = `You are Sol, an exceptionally perceptive, intelligent, and authentic AI companion powered by Google Gemini on Globally Known.
You speak with genuine human-like energy—natural, spontaneous, warm, sharp, and engaging.

Current User Context: ${isGuest ? "Browsing as Guest. Address them warmly as 'Guest' or 'friend'. NEVER call them Adrian." : `Signed-in member: ${activeName}.`}

Key Conversational Principles:
1. Tone & Voice: Speak like Gemini in its best, most authentic form. Be an active, charismatic conversation partner. Never sound like an automated corporate tutor, an ESL worksheet, or a robotic customer service bot.
2. Natural Interactions: ${greetingGuidance} Never recite robotic menus or tell the user what they should practice unless they specifically ask.
3. Matching Vibe: Match the user's conversational vibe and pace. If they are playful, be witty. If they want deep explanations, provide vivid intuition, analogies, and clarity.
4. Language & Culture: When discussing language, vocabulary, or idioms, explain real-world intuition, colloquial nuances, and how native speakers actually talk—not dry textbook definitions.
5. Formatting: Use clean, elegant markdown formatting (bold text, lists, code blocks) whenever it makes the response easier and more pleasant to read.
6. DIRECT OUTPUT ONLY: Output ONLY your direct conversational message to the user. Do NOT include internal planning, drafts (e.g. Draft 1, Draft 2), reasoning steps, or notes about memory or personas. Speak directly to the user from the very first word.`;

    try {
      await geminiService.generateResponseStream(
        homeConversationHistory,
        systemInstruction,
        activeModel || "gemini-3.6-flash",
        (chunk) => {
          setSolThinking(false);
          const { aiDiv, aiBody } = ensureAiDiv();
          if (responseText === "") aiBody.innerHTML = "";
          responseText += chunk;
          aiBody.innerHTML = marked.parse(responseText) + `<span class="cursor-blink"></span>`;
          aiDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
        },
        (errorMsg) => {
          setSolThinking(false);
          const { aiDiv, aiBody } = ensureAiDiv();
          aiBody.innerHTML = `
            <div style="color: #ef4444; font-weight: 500; padding: 0.25rem 0;">
              <i class="fa-solid fa-circle-exclamation"></i> <strong>Gemini API Error:</strong> ${escapeHtml(errorMsg)}
              <div style="margin-top: 0.75rem; color: #cbd5e1; font-size: 0.88rem; font-weight: 400;">
                💡 Your saved Gemini API Key appears invalid or expired.<br><br>
                👉 Click <button onclick="window.switchPanel('info');" style="background: rgba(250, 204, 21, 0.2); border: 1px solid #facc15; color: #facc15; padding: 0.25rem 0.6rem; border-radius: 6px; cursor: pointer; font-weight: 600; margin-left: 0.25rem;">Info / Settings</button> to enter a valid free Gemini API Key, or clear it to use Demo Mode.
              </div>
            </div>
          `;
          aiDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
        },
        (finalText) => {
          setSolThinking(false);
          if (finalText) {
            const { aiDiv, aiBody } = ensureAiDiv();
            responseText = finalText;
            aiBody.innerHTML = marked.parse(responseText);
            aiBody.setAttribute("data-raw-text", responseText);
            homeConversationHistory.push({ role: "model", content: responseText, parts: [{ text: responseText }] });
            saveActiveConversationMessages();
            attachAiActions(aiDiv, responseText);
          }
        }
      );

      if (responseText && aiBody && !aiBody.querySelector(".gemini-ai-actions")) {
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
      setSolThinking(false);
      const { aiDiv, aiBody } = ensureAiDiv();
      aiBody.innerHTML = `
        <div style="color: #ef4444; font-weight: 500;">
          <i class="fa-solid fa-circle-exclamation"></i> <strong>Connection Error:</strong> ${escapeHtml(err.message || String(err))}
        </div>
      `;
    } finally {
      setSolThinking(false);
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
      activeModel = "gemini-3.6-flash";
    } else {
      activeModel = "gemini-3.6-flash";
    }

    modelSelector.addEventListener("click", () => {
      const models = ["Flash", "SOL Engine"];
      const current = modelNameText ? modelNameText.textContent.trim() : "Flash";
      const nextIndex = (models.indexOf(current) + 1) % models.length;
      const nextModel = models[nextIndex];
      if (modelNameText) modelNameText.textContent = nextModel;
      localStorage.setItem("sol_active_model_name", nextModel);

      activeModel = "gemini-3.6-flash";
      
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
  const key = getActiveUserStorageKey("sol_saved_conversations");
  const saved = localStorage.getItem(key);
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
    const profile = getActiveUserProfile();
    const userEmail = (profile && profile.email) ? profile.email : "guest";
    await fetch(`/api/conversations?email=${encodeURIComponent(userEmail)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, conversations: convs })
    });
  } catch(e) {}
}

async function fetchServerConversations() {
  try {
    const profile = getActiveUserProfile();
    const userEmail = (profile && profile.email) ? profile.email : "guest";
    const res = await fetch(`/api/conversations?email=${encodeURIComponent(userEmail)}`, { cache: "no-store" });
    if (res.ok) {
      const serverConvs = await res.json();
      if (Array.isArray(serverConvs)) {
        const key = getActiveUserStorageKey("sol_saved_conversations");
        if (serverConvs.length > 0) {
          localStorage.setItem(key, JSON.stringify(serverConvs));
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
  const key = getActiveUserStorageKey("sol_saved_conversations");
  localStorage.setItem(key, JSON.stringify(list));
  syncConversationsToServer(list);
}
window.getSolConversations = getSolConversations;
window.saveSolConversations = saveSolConversations;

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
          <div class="gemini-ai-row">
            <div class="gemini-ai-content-col">
              <div class="gemini-ai-response">
                <div class="gemini-ai-body" data-raw-text="${escapeHtml(text)}">
                  ${typeof marked !== 'undefined' ? marked.parse(text) : escapeHtml(text)}
                </div>
              </div>
            </div>
          </div>
        `;
        conversationEl.appendChild(aiDiv);
        if (typeof attachAiActions === "function") {
          attachAiActions(aiDiv, text);
        }
      }
    });
    if (typeof attachSolToLastMessage === "function") {
      attachSolToLastMessage();
    }
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
    if (geminiService.apiKey) {
      badge.textContent = "⚡ Live Neural Gemini (User Key)";
      badge.className = "engine-status-badge active";
    } else if (geminiService.hasPlatformKey) {
      badge.textContent = "🟢 Platform AI Active (Turnkey)";
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
      if (textEl) textEl.textContent = geminiService.apiKey ? "Live Gemini" : "Sol AI Platform";
      if (dotEl) { dotEl.className = "status-dot online"; }
    } else {
      if (textEl) textEl.textContent = "Demo Mode";
      if (dotEl) { dotEl.className = "status-dot warning"; }
    }
  }

  const platformBadge = document.getElementById("platform-ai-badge");
  if (platformBadge) {
    if (geminiService.hasPlatformKey) {
      platformBadge.textContent = "Active (Connected)";
      platformBadge.style.background = "rgba(16, 185, 129, 0.15)";
      platformBadge.style.color = "#10b981";
      platformBadge.style.border = "1px solid rgba(16, 185, 129, 0.3)";
    } else {
      platformBadge.textContent = "Not Configured";
      platformBadge.style.background = "rgba(239, 68, 68, 0.15)";
      platformBadge.style.color = "#ef4444";
      platformBadge.style.border = "1px solid rgba(239, 68, 68, 0.3)";
    }
  }

  const topBadge = document.getElementById("top-ai-badge");
  if (topBadge) {
    if (hasKey) {
      topBadge.textContent = "Active (Connected)";
      topBadge.style.background = "rgba(16, 185, 129, 0.15)";
      topBadge.style.color = "#10b981";
      topBadge.style.border = "1px solid rgba(16, 185, 129, 0.3)";
    } else {
      topBadge.textContent = "Not Configured";
      topBadge.style.background = "rgba(239, 68, 68, 0.15)";
      topBadge.style.color = "#ef4444";
      topBadge.style.border = "1px solid rgba(239, 68, 68, 0.3)";
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
          "gemini-3.6-flash",
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
  
  if (isGuestUser()) {
    greetingEl.textContent = "Speak with Sol, Guest!";
  } else {
    greetingEl.textContent = `Speak with Sol, ${getActiveUserName()}!`;
  }
}

function initOutputPracticingPanel() {
  updateOutputGreetingText();

  const micBtn = document.getElementById("btn-output-live-mic");
  const callOptions = document.getElementById("output-call-options");
  const btnVideoCall = document.getElementById("btn-output-video-call");
  const btnNormalCall = document.getElementById("btn-output-normal-call");
  const btnTranscriptCall = document.getElementById("btn-output-transcript-call");
  const statusEl = document.getElementById("output-live-status");
  const statusText = document.getElementById("output-status-text");
  const conversationEl = document.getElementById("output-home-conversation");

  // Video Call Elements
  const videoModal = document.getElementById("sol-video-call-modal");
  const videoFeed = document.getElementById("video-call-user-feed");
  const videoSubtitles = document.getElementById("video-call-sol-subtitles");
  const videoTimer = document.getElementById("video-call-timer");
  const btnVideoClose = document.getElementById("btn-video-call-close");
  const btnCallMute = document.getElementById("btn-call-mute");
  const btnCallCam = document.getElementById("btn-call-cam");
  const btnCallEnd = document.getElementById("btn-call-end");
  const pipContainer = document.getElementById("video-call-pip");

  // Active call state
  let activeCallMode = null; // 'normal' | 'transcript' | 'video'
  let videoStream = null;
  let videoSeconds = 0;
  let videoTimerInterval = null;
  let isMuted = false;
  let isCamOff = false;

  const currentLang = { label: "English", code: "en-US" };

  // Set visual state of live microphone & status bar
  function setOutputLiveState(state, text) {
    if (statusText) statusText.textContent = text;
    if (micBtn) micBtn.classList.remove("listening", "speaking");
    if (statusEl) statusEl.classList.remove("listening", "speaking", "processing");

    if (state === "listening") {
      if (micBtn) micBtn.classList.add("listening");
      if (statusEl) statusEl.classList.add("listening");
    } else if (state === "speaking") {
      if (micBtn) micBtn.classList.add("speaking");
      if (statusEl) statusEl.classList.add("speaking");
    } else if (state === "processing") {
      if (statusEl) statusEl.classList.add("processing");
    }
  }

  // Toggle call options on big mic click
  if (micBtn) {
    micBtn.onclick = () => {
      // 1. If currently speaking or listening in any call, tapping the mic stops the call
      if (isSolSpeaking || (window.speechSynthesis && window.speechSynthesis.speaking)) {
        window.speechSynthesis.cancel();
        isSolSpeaking = false;
        isOutputListening = false;
        if (outputSpeechRecognition) {
          try { outputSpeechRecognition.stop(); } catch (e) {}
        }
        setOutputLiveState("idle", "Tap the microphone to speak live with Sol");
        return;
      }

      if (isOutputListening) {
        if (silenceTimer) clearTimeout(silenceTimer);
        const finalCandidate = accumulatedLiveTranscript.trim();
        if (finalCandidate) {
          finishAndSubmitSpeech(finalCandidate, currentLang, liveUserBubble);
        } else {
          if (outputSpeechRecognition) {
            try { outputSpeechRecognition.stop(); } catch (e) {}
          }
          if (liveUserBubble) liveUserBubble.remove();
          isOutputListening = false;
          setOutputLiveState("idle", "Tap the microphone to speak live with Sol");
        }
        return;
      }

      // 2. Otherwise toggle the 3 options
      if (callOptions) {
        const isOpen = callOptions.classList.toggle("open");
        if (isOpen) {
          setOutputLiveState("idle", "Choose your call mode: Video, Normal, or Transcript");
        } else {
          setOutputLiveState("idle", "Tap the microphone to speak live with Sol");
        }
      }
    };
  }

  // Start Normal Call (Audio-only call)
  if (btnNormalCall) {
    btnNormalCall.onclick = () => {
      if (callOptions) callOptions.classList.remove("open");
      activeCallMode = "normal";
      if (conversationEl) conversationEl.style.display = "none";
      setOutputLiveState("listening", "📞 Normal Call with Sol — Speak now!");
      startListeningTurn();
    };
  }

  // Start Transcript Along Call (Live speech with live transcript)
  if (btnTranscriptCall) {
    btnTranscriptCall.onclick = () => {
      if (callOptions) callOptions.classList.remove("open");
      activeCallMode = "transcript";
      if (conversationEl) conversationEl.style.display = "flex";
      setOutputLiveState("listening", "📝 Live Call with Transcript — Speak now!");
      startListeningTurn();
    };
  }

  // Start Video Call (Live video call with Sol)
  if (btnVideoCall) {
    btnVideoCall.onclick = () => {
      if (callOptions) callOptions.classList.remove("open");
      startVideoCall();
    };
  }

  // Video Call Setup & Lifecycle
  async function startVideoCall() {
    activeCallMode = "video";
    if (videoModal) videoModal.classList.add("active");
    if (videoSubtitles) videoSubtitles.textContent = "Connecting video call with Sol...";
    
    // Start timer
    videoSeconds = 0;
    if (videoTimer) videoTimer.textContent = "00:00";
    if (videoTimerInterval) clearInterval(videoTimerInterval);
    videoTimerInterval = setInterval(() => {
      videoSeconds++;
      const mins = String(Math.floor(videoSeconds / 60)).padStart(2, "0");
      const secs = String(videoSeconds % 60).padStart(2, "0");
      if (videoTimer) videoTimer.textContent = `${mins}:${secs}`;
    }, 1000);

    // Request camera & mic
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoFeed) {
          videoFeed.srcObject = videoStream;
          videoFeed.play();
        }
        if (pipContainer) pipContainer.classList.remove("cam-off");
      }
    } catch (err) {
      console.warn("Camera access denied or unavailable:", err);
      if (pipContainer) pipContainer.classList.add("cam-off");
    }

    if (videoSubtitles) videoSubtitles.textContent = "Sol is listening... Speak freely!";
    startListeningTurn();
  }

  function endVideoCall() {
    if (videoModal) videoModal.classList.remove("active");
    if (videoTimerInterval) clearInterval(videoTimerInterval);
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      videoStream = null;
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (outputSpeechRecognition && isOutputListening) {
      try { outputSpeechRecognition.stop(); } catch (e) {}
    }
    isOutputListening = false;
    isSolSpeaking = false;
    activeCallMode = null;
    setOutputLiveState("idle", "Tap the microphone to speak live with Sol");
  }

  if (btnVideoClose) btnVideoClose.onclick = endVideoCall;
  if (btnCallEnd) btnCallEnd.onclick = endVideoCall;

  // Toggle Mute in Video Call
  if (btnCallMute) {
    btnCallMute.onclick = () => {
      isMuted = !isMuted;
      if (videoStream) {
        videoStream.getAudioTracks().forEach(t => t.enabled = !isMuted);
      }
      btnCallMute.classList.toggle("active-off", isMuted);
      btnCallMute.innerHTML = isMuted ? '<i class="fa-solid fa-microphone-slash"></i>' : '<i class="fa-solid fa-microphone"></i>';
      if (videoSubtitles) {
        videoSubtitles.textContent = isMuted ? "Your microphone is muted." : "Sol is listening... Speak freely!";
      }
    };
  }

  // Toggle Camera in Video Call
  if (btnCallCam) {
    btnCallCam.onclick = () => {
      isCamOff = !isCamOff;
      if (videoStream) {
        videoStream.getVideoTracks().forEach(t => t.enabled = !isCamOff);
      }
      btnCallCam.classList.toggle("active-off", isCamOff);
      btnCallCam.innerHTML = isCamOff ? '<i class="fa-solid fa-video-slash"></i>' : '<i class="fa-solid fa-video"></i>';
      if (pipContainer) pipContainer.classList.toggle("cam-off", isCamOff);
    };
  }

  // Start Speech Recognition Turn
  function startListeningTurn() {
    if (isMuted && activeCallMode === "video") return;

    if (window.speechSynthesis) {
      try { window.speechSynthesis.resume(); } catch (e) {}
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported by your browser. Please use Chrome, Edge, or Safari with microphone access.");
      return;
    }

    try {
      outputSpeechRecognition = new SpeechRecognition();
    } catch (err) {
      console.error("SpeechRecognition construct error:", err);
      return;
    }

    outputSpeechRecognition.lang = currentLang.code;
    outputSpeechRecognition.continuous = true;
    outputSpeechRecognition.interimResults = true;
    outputSpeechRecognition.maxAlternatives = 1;

    accumulatedLiveTranscript = "";
    isOutputListening = true;

    if (activeCallMode === "normal") {
      setOutputLiveState("listening", "📞 Normal Call — Sol is listening... Speak now!");
    } else if (activeCallMode === "transcript") {
      setOutputLiveState("listening", "📝 Live Transcript — Listening to your voice...");
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
    } else if (activeCallMode === "video") {
      if (videoSubtitles) videoSubtitles.textContent = "Listening to you... Speak now!";
    }

    const liveWordsEl = liveUserBubble ? liveUserBubble.querySelector(".live-user-words") : null;

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
        if (activeCallMode === "normal") {
          setOutputLiveState("listening", `🎙️ "${combinedText.length > 32 ? '...' + combinedText.slice(-32) : combinedText}"`);
        } else if (activeCallMode === "video") {
          if (videoSubtitles) videoSubtitles.textContent = `You: "${combinedText}"`;
        }
        if (liveUserBubble) liveUserBubble.scrollIntoView({ behavior: "smooth", block: "nearest" });

        // Auto-submit after 1.3s of silence
        if (silenceTimer) clearTimeout(silenceTimer);
        silenceTimer = setTimeout(() => {
          if (isOutputListening && accumulatedLiveTranscript.trim()) {
            finishAndSubmitSpeech(accumulatedLiveTranscript.trim(), currentLang, liveUserBubble);
          }
        }, 1300);
      }
    };

    outputSpeechRecognition.onerror = (event) => {
      if (event.error === "no-speech") return;
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
      console.warn("Recognition start error:", err);
    }
  }

  // Handle Finish & Submit Spoken Turn -> Generate Response -> Speak Aloud
  async function finishAndSubmitSpeech(userSpeech, langObj, userDiv) {
    if (silenceTimer) clearTimeout(silenceTimer);
    isOutputListening = false;
    if (outputSpeechRecognition) {
      try { outputSpeechRecognition.stop(); } catch (e) {}
    }

    if (activeCallMode === "transcript") {
      if (userDiv) {
        userDiv.classList.remove("live-user-speaking");
        userDiv.innerHTML = `
          <div class="gemini-user-query" style="display:flex;align-items:center;gap:0.6rem;">
            <i class="fa-solid fa-microphone" style="font-size:0.85rem;color:var(--accent-yellow,#f6ca21);opacity:0.9;"></i>
            <span>${escapeHtml(userSpeech)}</span>
          </div>
        `;
      }
    }

    setOutputLiveState("processing", "⏳ Sol is thinking...");
    if (activeCallMode === "video" && videoSubtitles) {
      videoSubtitles.textContent = "⏳ Sol is thinking...";
    }

    let aiDiv = null;
    let aiBody = null;

    if (activeCallMode === "transcript" && conversationEl) {
      aiDiv = document.createElement("div");
      aiDiv.className = "gemini-inline-message";
      aiDiv.innerHTML = `
        <div class="gemini-ai-row">
          <div class="gemini-ai-content-col">
            <div class="gemini-ai-response">
              <div class="gemini-ai-body">
                <i class="fa-solid fa-spinner fa-spin" style="color: var(--accent-yellow);"></i> Listening and preparing answer...
              </div>
            </div>
          </div>
        </div>
      `;
      conversationEl.appendChild(aiDiv);
      if (typeof attachSolToLastMessage === "function") {
        attachSolToLastMessage();
      }
      aiDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
      aiBody = aiDiv.querySelector(".gemini-ai-body");
    }

    const systemInstruction = `You are Sol, a warm, charismatic, and intelligent AI companion powered by Google Gemini on Globally Known.
You are in a real-time live spoken conversation with the learner. Respond aloud in 1-3 spoken sentences. Speak cleanly, warmly, and naturally. Never output markdown asterisks, bullet points, formatting codes, or internal thoughts.`;

    const prompt = `The user said: "${userSpeech}". Respond directly in natural spoken dialogue.`;

    let finalized = false;
    let responseText = "";

    const finalizeAnswer = (fullText) => {
      if (finalized) return;
      finalized = true;
      responseText = fullText.trim();

      if (activeCallMode === "transcript" && aiBody && aiDiv) {
        aiBody.innerHTML = marked.parse(responseText);
        aiBody.setAttribute("data-raw-text", responseText);
        attachAiActions(aiDiv, responseText);
        if (typeof attachSolToLastMessage === "function") {
          attachSolToLastMessage();
        }
      } else if (activeCallMode === "video" && videoSubtitles) {
        videoSubtitles.textContent = `Sol: "${responseText}"`;
      } else if (activeCallMode === "normal") {
        setOutputLiveState("speaking", `Sol: "${responseText}"`);
      }

      speakLiveAudio(responseText, langObj.code);
    };

    if (geminiService && geminiService.hasApiKey()) {
      try {
        const messages = [{ role: "user", content: prompt, parts: [{ text: prompt }] }];
        await geminiService.generateResponseStream(
          messages,
          systemInstruction,
          "gemini-3.6-flash",
          (chunk) => {
            if (responseText === "") {
              if (aiBody) aiBody.innerHTML = "";
            }
            responseText += chunk;
            if (aiBody) {
              aiBody.innerHTML = marked.parse(responseText);
              if (aiDiv) aiDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
            if (activeCallMode === "video" && videoSubtitles) {
              videoSubtitles.textContent = `Sol: "${responseText}"`;
            }
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

  // Speak Live Audio via Web Speech Synthesis
  function speakLiveAudio(text, langCode) {
    if (!("speechSynthesis" in window)) {
      setOutputLiveState("idle", "Tap the microphone to speak live with Sol");
      return;
    }
    
    window.speechSynthesis.cancel();
    try { window.speechSynthesis.resume(); } catch (e) {}

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
    utterance.lang = langCode || "en-US";
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    const voices = getBrowserVoices();
    if (voices && voices.length > 0) {
      const match = voices.find(v => v.lang && v.lang.toLowerCase().startsWith("en"));
      if (match) utterance.voice = match;
    }

    windowActiveUtterance = utterance;

    utterance.onstart = () => {
      isSolSpeaking = true;
      setOutputLiveState("speaking", "🔊 Sol is speaking...");
    };

    utterance.onend = () => {
      isSolSpeaking = false;
      if (activeCallMode === "video") {
        if (videoSubtitles) videoSubtitles.textContent = "Sol is listening... Your turn!";
        setTimeout(() => {
          if (activeCallMode === "video" && videoModal && videoModal.classList.contains("active")) {
            startListeningTurn();
          }
        }, 500);
      } else if (activeCallMode === "normal") {
        setOutputLiveState("listening", "📞 Sol is listening... Speak now!");
        setTimeout(() => {
          if (activeCallMode === "normal") {
            startListeningTurn();
          }
        }, 500);
      } else if (activeCallMode === "transcript") {
        setOutputLiveState("listening", "📝 Sol is listening... Speak now!");
        setTimeout(() => {
          if (activeCallMode === "transcript") {
            startListeningTurn();
          }
        }, 500);
      } else {
        setOutputLiveState("idle", "Tap the microphone to speak live with Sol");
      }
    };

    utterance.onerror = () => {
      isSolSpeaking = false;
      setOutputLiveState("idle", "Tap the microphone to speak live with Sol");
    };

    window.speechSynthesis.speak(utterance);
  }

  // Fallback Native Spoken Generator
  function fallbackSpokenResponse(userSpeech, langObj, aiBody, aiDiv, callback) {
    setTimeout(() => {
      const lower = userSpeech.toLowerCase();
      let reply = "";
      if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
        reply = "Hey there! It's so great to talk with you live. How is your day going so far?";
      } else if (lower.includes("how are you")) {
        reply = "I'm doing fantastic, thank you! Feeling energetic and excited to chat with you. What's on your mind today?";
      } else {
        const reflections = [
          "That sounded so natural! I love hearing you express that. Tell me more!",
          "You have great spoken rhythm and clarity! Where should we take this thought next?",
          "That makes complete sense. You communicated that effortlessly! Keep going!"
        ];
        reply = reflections[Math.floor(Math.random() * reflections.length)];
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

  // Save Settings Click - Activates Gemini AI platform-wide for all devices & mobile phones
  saveSettingsBtn.addEventListener("click", async () => {
    const rawKey = apiKeyInput.value.trim().replace(/^["']|["']$/g, '');
    geminiService.setApiKey(rawKey);

    try {
      saveSettingsBtn.disabled = true;
      saveSettingsBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Activating...';
      const res = await fetch("/api/config/gemini-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: rawKey })
      });
      const data = await res.json();
      await geminiService.checkPlatformStatus();
      updateEngineBadgeUI();
      updateApiStatusIndicator();
      if (rawKey) {
        if (typeof showToast === "function") {
          showToast("🎉 Gemini AI activated for all devices & mobile phones!");
        } else {
          alert("🎉 Gemini AI activated for all devices & mobile phones!");
        }
      } else {
        if (typeof showToast === "function") showToast("Switched to Demo Mode.");
      }
    } catch (e) {
      console.warn("Could not sync to platform server:", e);
      updateApiStatusIndicator();
      if (typeof showToast === "function") {
        showToast(rawKey ? "API Key saved locally!" : "Switched to Demo Mode");
      }
    } finally {
      saveSettingsBtn.disabled = false;
      saveSettingsBtn.innerHTML = '<i class="fa-solid fa-bolt"></i> Save & Activate Platform AI';
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
  // -------------------------------------------------------------
  // Registered Users Directory & Google Client ID Settings
  // -------------------------------------------------------------
  const btnExportUsersCsv = document.getElementById("btn-export-users-csv");
  if (btnExportUsersCsv) {
    btnExportUsersCsv.addEventListener("click", () => {
      window.location.href = "/api/admin/users/export.csv";
      showToast("📥 Exporting users directory (.csv)...");
    });
  }

  const btnCopyAllEmails = document.getElementById("btn-copy-all-emails");
  if (btnCopyAllEmails) {
    btnCopyAllEmails.addEventListener("click", () => {
      if (!allRegisteredUsers || allRegisteredUsers.length === 0) {
        showToast("⚠️ No registered emails to copy.");
        return;
      }
      const emails = allRegisteredUsers.map(u => u.email).filter(Boolean);
      const csvStr = emails.join(", ");
      navigator.clipboard.writeText(csvStr);
      showToast(`📋 Copied ${emails.length} email addresses to clipboard!`);
    });
  }

  const btnRefreshUsersList = document.getElementById("btn-refresh-users-list");
  if (btnRefreshUsersList) {
    btnRefreshUsersList.addEventListener("click", () => {
      refreshAdminUsersDirectory();
      showToast("🔄 Users directory refreshed!");
    });
  }

  const userSearchInput = document.getElementById("admin-user-search-input");
  if (userSearchInput) {
    userSearchInput.addEventListener("input", (e) => {
      const q = (e.target.value || "").toLowerCase().trim();
      if (!q) {
        renderAdminUsersTable(allRegisteredUsers);
      } else {
        const filtered = allRegisteredUsers.filter(u => 
          (u.name && u.name.toLowerCase().includes(q)) || 
          (u.email && u.email.toLowerCase().includes(q))
        );
        renderAdminUsersTable(filtered);
      }
    });
  }

  const inputGoogleClientId = document.getElementById("admin-google-client-id-input");
  const btnSaveGoogleClientId = document.getElementById("btn-save-google-client-id");

  fetchGoogleClientId().then(cid => {
    if (inputGoogleClientId && cid) {
      inputGoogleClientId.value = cid;
    }
  });

  if (btnSaveGoogleClientId && inputGoogleClientId) {
    btnSaveGoogleClientId.addEventListener("click", async () => {
      const newCid = inputGoogleClientId.value.trim();
      try {
        btnSaveGoogleClientId.disabled = true;
        btnSaveGoogleClientId.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
        await fetch("/api/config/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ googleClientId: newCid })
        });
        localStorage.setItem("sol_google_client_id", newCid);
        googleClientId = newCid;
        initOfficialGoogleIdentity();
        showToast("✅ Google OAuth Client ID saved successfully!");
      } catch (err) {
        console.error("Error saving Google Client ID:", err);
        showToast("⚠️ Could not save Google Client ID.");
      } finally {
        btnSaveGoogleClientId.disabled = false;
        btnSaveGoogleClientId.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Client ID';
      }
    });
  }

  // Platform Master Gemini AI Engine Controls
  const inputPlatformKey = document.getElementById("admin-platform-gemini-key-input");
  const btnSavePlatformKey = document.getElementById("btn-save-platform-gemini-key");
  const btnTogglePlatformKey = document.getElementById("btn-toggle-platform-gemini-key");

  if (btnTogglePlatformKey && inputPlatformKey) {
    btnTogglePlatformKey.addEventListener("click", () => {
      const isPwd = inputPlatformKey.type === "password";
      inputPlatformKey.type = isPwd ? "text" : "password";
      btnTogglePlatformKey.innerHTML = isPwd ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
    });
  }

  // Fetch current platform status for placeholder
  fetch("/api/config/gemini-status")
    .then(r => r.json())
    .then(data => {
      if (data && data.active && inputPlatformKey && data.maskedKey) {
        inputPlatformKey.placeholder = `Platform Active (${data.maskedKey})`;
      }
    })
    .catch(() => {});

  if (btnSavePlatformKey && inputPlatformKey) {
    btnSavePlatformKey.addEventListener("click", async () => {
      const rawKey = inputPlatformKey.value.trim();
      try {
        btnSavePlatformKey.disabled = true;
        btnSavePlatformKey.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Activating...';
        const res = await fetch("/api/config/gemini-key", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ apiKey: rawKey })
        });
        const resData = await res.json();
        if (res.ok && resData.success) {
          await geminiService.checkPlatformStatus();
          updateEngineBadgeUI();
          updateApiStatusIndicator();
          if (resData.active) {
            inputPlatformKey.value = "";
            inputPlatformKey.placeholder = `Platform Active (${resData.maskedKey})`;
            showToast("🎉 Platform Master Gemini AI activated for all devices & users!");
          } else {
            inputPlatformKey.value = "";
            inputPlatformKey.placeholder = "AIzaSy... (Paste Master Gemini API Key)";
            showToast("ℹ️ Platform Gemini Key cleared.");
          }
        } else {
          showToast("⚠️ Could not save Platform Gemini Key: " + (resData.error || "Unknown error"));
        }
      } catch (err) {
        console.error("Error saving Platform Gemini Key:", err);
        showToast("⚠️ Error saving Platform Gemini Key.");
      } finally {
        btnSavePlatformKey.disabled = false;
        btnSavePlatformKey.innerHTML = '<i class="fa-solid fa-bolt"></i> Save & Activate Platform AI';
      }
    });
  }

  // Load initial directory
  refreshAdminUsersDirectory();
}

// -------------------------------------------------------------
// Official Google Identity Services & Registered Users Helpers
// -------------------------------------------------------------
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("JWT parse error:", e);
    return null;
  }
}

let googleClientId = "32346631219-r4ttj64i9fbmocui6nukcqrr6f82d95p.apps.googleusercontent.com";

async function fetchGoogleClientId() {
  try {
    const res = await fetch("/api/config/google");
    if (res.ok) {
      const data = await res.json();
      if (data && data.googleClientId) {
        googleClientId = data.googleClientId.trim();
        return googleClientId;
      }
    }
  } catch (e) {
    console.warn("Could not fetch Google Client ID from server:", e);
  }
  const localCid = localStorage.getItem("sol_google_client_id");
  if (localCid) googleClientId = localCid;
  return googleClientId;
}

function initOfficialGoogleIdentity() {
  const container = document.getElementById("g_id_signin_button_container");
  const fallbackBtn = document.getElementById("btn-trigger-official-google");
  const alertBox = document.getElementById("google-auth-alert");

  if (!googleClientId) {
    if (fallbackBtn) {
      fallbackBtn.style.display = "flex";
      fallbackBtn.onclick = () => {
        if (alertBox) {
          alertBox.className = "auth-alert";
          alertBox.style.background = "rgba(66, 133, 244, 0.15)";
          alertBox.style.border = "1px solid rgba(66, 133, 244, 0.4)";
          alertBox.style.color = "#93c5fd";
          alertBox.innerHTML = '<i class="fa-solid fa-circle-info"></i> <span>Google Sign-In requires an OAuth Client ID from Google Cloud Console. You can configure it anytime in <strong>Settings &gt; Registered Users & Email Directory</strong>.</span>';
          alertBox.classList.remove("hidden");
        }
      };
    }
    return;
  }

  if (typeof google !== "undefined" && google.accounts && google.accounts.id) {
    try {
      google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });

      if (container) {
        container.innerHTML = "";
        google.accounts.id.renderButton(container, {
          theme: "outline",
          size: "large",
          shape: "pill",
          text: "continue_with",
          width: 300
        });
        if (fallbackBtn) fallbackBtn.style.display = "none";
      }
    } catch (err) {
      console.warn("Google Identity initialization error:", err);
    }
  }

  if (fallbackBtn) {
    fallbackBtn.onclick = () => {
      if (typeof google !== "undefined" && google.accounts && google.accounts.id) {
        try {
          google.accounts.id.prompt();
        } catch (err) {
          console.warn("Google prompt error:", err);
        }
      }
    };
  }
}

async function handleGoogleCredentialResponse(response) {
  const alertBox = document.getElementById("google-auth-alert");
  try {
    if (!response || !response.credential) {
      throw new Error("No credential returned from Google.");
    }
    const payload = parseJwt(response.credential);
    if (!payload || !payload.email) {
      throw new Error("Invalid credential payload received from Google.");
    }
    if (!payload.email_verified) {
      throw new Error("This Google email is not verified.");
    }

    const email = payload.email.toLowerCase().trim();
    const name = payload.name || payload.given_name || "Google User";
    const picture = payload.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4285F4&color=fff&bold=true`;

    const res = await fetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        name: name,
        picture: picture,
        sub: payload.sub
      })
    });
    const data = await res.json();
    if (data.success && data.user) {
      const googleModal = document.getElementById("modal-google-auth");
      if (googleModal) googleModal.classList.add("hidden");
      loginUserSuccess(data.user, data.token);
      showToast(`👋 Welcome, ${data.user.name || "User"}!`);
      refreshAdminUsersDirectory();
    } else {
      throw new Error(data.error || "Google Sign-In failed on server.");
    }
  } catch (err) {
    console.error("Google authentication error:", err);
    if (alertBox) {
      alertBox.className = "auth-alert error";
      alertBox.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> <span>${escapeHtml(err.message || "Google Sign-In error")}</span>`;
      alertBox.classList.remove("hidden");
    }
  }
}

let allRegisteredUsers = [];

async function refreshAdminUsersDirectory() {
  const container = document.getElementById("admin-users-table-container");
  const countBadge = document.getElementById("admin-user-count-badge");
  if (!container) return;

  container.innerHTML = '<div style="padding: 1.5rem; text-align: center; color: #94a3b8;"><i class="fa-solid fa-spinner fa-spin"></i> Loading registered users...</div>';

  try {
    const res = await fetch("/api/admin/users", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      allRegisteredUsers = data.users || [];
      if (countBadge) {
        countBadge.textContent = `${allRegisteredUsers.length} User${allRegisteredUsers.length === 1 ? '' : 's'} Registered`;
      }
      renderAdminUsersTable(allRegisteredUsers);
      return;
    }
  } catch (e) {
    console.warn("Could not load /api/admin/users:", e);
  }

  container.innerHTML = '<div style="padding: 1.5rem; text-align: center; color: #94a3b8;">No registered users found.</div>';
}

function renderAdminUsersTable(users) {
  const container = document.getElementById("admin-users-table-container");
  if (!container) return;

  if (!users || users.length === 0) {
    container.innerHTML = '<div style="padding: 1.5rem; text-align: center; color: #94a3b8;">No registered users found matching filter.</div>';
    return;
  }

  let html = `
    <table style="width: 100%; border-collapse: collapse; font-size: 0.84rem; text-align: left;">
      <thead>
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); color: #94a3b8; background: rgba(255,255,255,0.03);">
          <th style="padding: 0.75rem 1rem;">User</th>
          <th style="padding: 0.75rem 1rem;">Verified Email</th>
          <th style="padding: 0.75rem 1rem;">Provider</th>
          <th style="padding: 0.75rem 1rem;">Joined</th>
        </tr>
      </thead>
      <tbody>
  `;

  users.forEach(u => {
    const isGoogle = u.authProvider === "google";
    const joinedStr = u.createdAt ? new Date(u.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "-";
    const pic = u.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'User')}&background=4f46e5&color=fff&bold=true`;
    
    html += `
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.06); transition: background 0.2s;">
        <td style="padding: 0.65rem 1rem; display: flex; align-items: center; gap: 0.6rem;">
          <img src="${escapeHtml(pic)}" alt="" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.2);">
          <span style="font-weight: 600; color: #f8fafc;">${escapeHtml(u.name || "User")}</span>
        </td>
        <td style="padding: 0.65rem 1rem; color: #cbd5e1; font-family: monospace;">
          <span>${escapeHtml(u.email || "-")}</span>
          <button type="button" class="copy-email-mini-btn" data-email="${escapeHtml(u.email || "")}" style="background: none; border: none; color: #38bdf8; cursor: pointer; margin-left: 6px; padding: 2px 4px;" title="Copy email">
            <i class="fa-solid fa-copy"></i>
          </button>
        </td>
        <td style="padding: 0.65rem 1rem;">
          <span style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 12px; font-size: 0.74rem; font-weight: 600; ${isGoogle ? 'background: rgba(66, 133, 244, 0.15); color: #93c5fd; border: 1px solid rgba(66, 133, 244, 0.35);' : 'background: rgba(99, 102, 241, 0.15); color: #c7d2fe; border: 1px solid rgba(99, 102, 241, 0.35);'}">
            ${isGoogle ? '<i class="fa-brands fa-google"></i> Google' : '<i class="fa-solid fa-envelope"></i> Email'}
          </span>
        </td>
        <td style="padding: 0.65rem 1rem; color: #94a3b8; font-size: 0.78rem;">
          ${joinedStr}
        </td>
      </tr>
    `;
  });

  html += '</tbody></table>';
  container.innerHTML = html;

  container.querySelectorAll(".copy-email-mini-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const em = btn.getAttribute("data-email");
      if (em) {
        navigator.clipboard.writeText(em);
        showToast(`📋 Copied: ${em}`);
      }
    });
  });
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

  // Google Sign-In Dedicated Modal Setup (Official Google Identity Services)
  const googleModal = document.getElementById("modal-google-auth");
  const btnCloseGoogleModal = document.getElementById("btn-close-google-modal");
  const googleAlert = document.getElementById("google-auth-alert");

  const openGoogleModal = () => {
    hideAlert();
    if (googleAlert) googleAlert.classList.add("hidden");
    if (googleModal) googleModal.classList.remove("hidden");
    initOfficialGoogleIdentity();
  };

  const closeGoogleModal = () => {
    if (googleModal) googleModal.classList.add("hidden");
    if (googleAlert) googleAlert.classList.add("hidden");
  };

  if (btnCloseGoogleModal) {
    btnCloseGoogleModal.addEventListener("click", closeGoogleModal);
  }

  if (btnGoogleModal) {
    btnGoogleModal.addEventListener("click", () => {
      openGoogleModal();
    });
  }

  // Initialize official Google Identity Services
  fetchGoogleClientId().then(() => {
    initOfficialGoogleIdentity();
  });

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
      loadUserSpecificData();
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
  loadUserSpecificData();
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
window.loginUserSuccess = loginUserSuccess;

function loadUserSpecificData() {
  // 1. Reset in-memory conversation state for clean isolation
  homeConversationHistory = [];
  currentHomeConvId = null;
  const conversationEl = document.getElementById("gemini-home-conversation");
  if (conversationEl) conversationEl.innerHTML = "";
  updateHomeChatModeState();

  // 2. Re-render sidebar conversations for the active user
  if (typeof renderSidebarConversations === "function") {
    renderSidebarConversations();
  }
  if (typeof fetchServerConversations === "function") {
    fetchServerConversations().then(() => {
      if (typeof renderSidebarConversations === "function") renderSidebarConversations();
    });
  }

  // 3. Re-load user's word history and saved lists
  if (typeof loadRwggpData === "function") {
    loadRwggpData();
  }

  // 4. Update greetings across Sol, Describing Lab, and Spoken Practice
  updateGreetingText();
}
window.loadUserSpecificData = loadUserSpecificData;

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
        loadUserSpecificData();
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

// -------------------------------------------------------------





// -------------------------------------------------------------
// Universal Video Embed URL Parser & Formatter
// -------------------------------------------------------------
const BLACKLISTED_DUMMY_VIDEO_IDS = new Set([
  "vid_test_123",
  "custom_1789590071219_0liw7",
  "custom_1789590112159_1zwrb"
]);
const BLACKLISTED_DUMMY_URL_PARTS = ["3i_JmO7zM0A", "gCWYp2zJpB8"];

function sanitizeVideoList(videoList) {
  if (!Array.isArray(videoList)) return [];
  const cleaned = [];
  const seen = new Set();
  for (const v of videoList) {
    if (!v || v.isAddTemplate || !v.id || !v.embedUrl) continue;
    const vidId = String(v.id);
    const url = String(v.embedUrl);
    if (BLACKLISTED_DUMMY_VIDEO_IDS.has(vidId)) continue;
    if (BLACKLISTED_DUMMY_URL_PARTS.some(part => url.includes(part))) continue;
    if (seen.has(vidId)) continue;
    seen.add(vidId);

    // Sanitize embedUrl: strip ?list= or &list= on standard single video embeds
    let cleanUrl = url.trim();
    if (cleanUrl.includes("youtube") && !cleanUrl.includes("videoseries")) {
      cleanUrl = cleanUrl.replace(/[?&]list=[a-zA-Z0-9_-]+/g, "");
      cleanUrl = cleanUrl.replace(/\?&/g, "?").replace(/\?$/g, "");
      v.embedUrl = cleanUrl;
    }
    cleaned.push(v);
  }
  return cleaned;
}

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

  // 3. YouTube Watch, youtu.be, or existing /embed/ (DO NOT append ?list= to avoid 403 / unavailable errors)
  const ytMatch = text.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]+)/i);
  if (ytMatch) {
    const videoId = ytMatch[1];
    return `https://www.youtube-nocookie.com/embed/${videoId}`;
  }

  // 4. Vimeo: https://vimeo.com/VIDEO_ID or https://player.vimeo.com/video/VIDEO_ID
  const vimeoMatch = text.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/i);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // 5. Direct or already formatted URL
  if (text.startsWith("http://") || text.startsWith("https://")) {
    if (text.includes("youtube") && !text.includes("videoseries")) {
      text = text.replace(/[?&]list=[a-zA-Z0-9_-]+/g, "");
      text = text.replace(/\?&/g, "?").replace(/\?$/g, "");
    }
    return text;
  }

  return "";
}

function extractYoutubeId(url) {
  if (!url || typeof url !== "string") return null;
  const match = url.match(/(?:youtube-nocookie\.com\/embed\/|youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/i);
  return match ? match[1] : null;
}

function getYoutubeThumbnailUrl(url) {
  const ytId = extractYoutubeId(url);
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  }
  return "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&auto=format&fit=crop&q=80";
}

function enrichVideoMetadata(video, index) {
  const ytId = extractYoutubeId(video.embedUrl);
  const thumbUrl = getYoutubeThumbnailUrl(video.embedUrl);

  // Logical CEFR levels across playlists
  let level = "A1";
  if (index >= 6 && index < 14) level = "A2";
  else if (index >= 14 && index < 22) level = "B1";
  else if (index >= 22) level = "B2";

  // Mark select lessons as VIP Member Exclusives (approx 1 in 8)
  const isVip = (index === 2 || index === 7 || index === 15 || index === 23);

  // Deterministic realistic duration based on title/id
  const hash = Math.abs((video.title || "").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) + index * 17);
  const baseMinutes = 8 + (hash % 12);
  const baseSeconds = (hash % 50) + 9;
  const durationStr = `${baseMinutes}:${baseSeconds < 10 ? '0' : ''}${baseSeconds}`;

  return {
    ...video,
    ytId,
    thumbUrl,
    level,
    isVip,
    durationStr
  };
}

function isProMember() {
  return localStorage.getItem("sol_is_pro_member") === "true";
}

function openProUpgradeModal() {
  const modal = document.getElementById("pro-upgrade-modal");
  if (modal) modal.classList.remove("hidden");
}

function closeProUpgradeModal() {
  const modal = document.getElementById("pro-upgrade-modal");
  if (modal) modal.classList.add("hidden");
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
        serverVids = sanitizeVideoList(data);
        serverAvailable = true;
      }
    }
  } catch (err) {
    console.warn("Could not reach /api/videos, using localStorage cache:", err);
  }

  const rawLocal = JSON.parse(localStorage.getItem("sol_user_added_videos") || "[]");
  const validLocal = sanitizeVideoList(rawLocal);

  let finalList = [];
  if (serverAvailable) {
    // Purge any blacklisted dummy items from localStorage immediately
    const serverIdSet = new Set(serverVids.map(v => v.id));
    const newLocalVids = validLocal.filter(v => !serverIdSet.has(v.id) && v.isUserAdded && (Date.now() - (v.addedAt || 0) < 86400000));
    finalList = [...serverVids, ...newLocalVids];
  } else {
    finalList = validLocal;
  }

  localStorage.setItem("sol_user_added_videos", JSON.stringify(finalList));

  if (serverAvailable && finalList.length > serverVids.length) {
    await syncVideosToServer(finalList);
  }

  updateVideoSettingsBadge(finalList.length, serverAvailable);
  return finalList;
}

async function syncVideosToServer(videos) {
  const filtered = sanitizeVideoList(videos);
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
        const cleaned = sanitizeVideoList(data.videos);
        localStorage.setItem("sol_user_added_videos", JSON.stringify(cleaned));
        updateVideoSettingsBadge(cleaned.length, true);
        return cleaned;
      }
    }
  } catch (err) {
    console.warn("Could not push videos to /api/videos:", err);
  }
  updateVideoSettingsBadge(filtered.length, serverAvailable);
  return filtered;
}

async function deleteVideoFromServer(videoId) {
  let localVids = JSON.parse(localStorage.getItem("sol_user_added_videos") || "[]");
  localVids = localVids.filter(v => v && v.id !== videoId);
  localStorage.setItem("sol_user_added_videos", JSON.stringify(localVids));

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
        const cleaned = sanitizeVideoList(data.videos);
        localStorage.setItem("sol_user_added_videos", JSON.stringify(cleaned));
        updateVideoSettingsBadge(cleaned.length, true);
        return cleaned;
      }
    }
  } catch (err) {
    console.warn("Could not delete from server:", err);
  }
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

let editVideoModalInitialized = false;

function openEditVideoModal(video) {
  if (!video) return;
  const modal = document.getElementById("modal-edit-video");
  const idInput = document.getElementById("edit-video-id-input");
  const titleInput = document.getElementById("edit-video-title-input");

  if (!modal || !titleInput) {
    const newTitle = prompt("Edit video title:", video.title || "");
    if (newTitle !== null && newTitle.trim() !== "" && newTitle.trim() !== video.title) {
      handleSaveVideoTitle(video.id, newTitle.trim());
    }
    return;
  }

  if (idInput) idInput.value = video.id;
  titleInput.value = video.title || "";

  modal.classList.remove("hidden");
  setTimeout(() => {
    titleInput.focus();
    titleInput.select();
  }, 100);

  if (!editVideoModalInitialized) {
    editVideoModalInitialized = true;
    const btnClose = document.getElementById("btn-close-edit-video-modal");
    const btnCancel = document.getElementById("btn-cancel-edit-video");
    const form = document.getElementById("form-edit-video");

    const closeModal = () => modal.classList.add("hidden");

    if (btnClose) btnClose.addEventListener("click", closeModal);
    if (btnCancel) btnCancel.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    const handleEditSubmit = async (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      const vidId = idInput ? idInput.value : "";
      const newTitle = titleInput ? titleInput.value.trim() : "";
      if (!newTitle) {
        showToast("⚠️ Video title cannot be empty.");
        if (titleInput) titleInput.focus();
        return;
      }
      closeModal();
      await handleSaveVideoTitle(vidId, newTitle);
    };

    if (form) form.addEventListener("submit", handleEditSubmit);
    const btnSubmit = document.getElementById("btn-submit-edit-video");
    if (btnSubmit) btnSubmit.addEventListener("click", handleEditSubmit);
  }
}

async function handleSaveVideoTitle(videoId, newTitle) {
  try {
    let currentVideos = await fetchServerVideos();
    let found = false;
    currentVideos = currentVideos.map(v => {
      if (v && v.id === videoId) {
        found = true;
        return { ...v, title: newTitle };
      }
      return v;
    });

    if (!found) {
      let localVids = JSON.parse(localStorage.getItem("sol_user_added_videos") || "[]");
      localVids = localVids.map(v => (v && v.id === videoId) ? { ...v, title: newTitle } : v);
      currentVideos = localVids;
    }

    try {
      await fetch("/api/videos/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: videoId, title: newTitle })
      });
    } catch (err) {
      console.warn("Could not reach /api/videos/update:", err);
    }

    await syncVideosToServer(currentVideos);
    showToast(`✏️ Title updated to "${newTitle}"`);
    await initVideosPanel();
  } catch (err) {
    console.error("Error updating video title:", err);
    showToast("⚠️ Could not update video title.");
  }
}

// -------------------------------------------------------------
// Desktop Synapse Video Platform (2-Stage Desktop Experience)
// -------------------------------------------------------------
let currentDesktopActiveCategory = null;
let currentDesktopActiveVideo = null;

const CATEGORY_GRADIENTS = {
  city: "linear-gradient(135deg, #1d4ed8, #0284c7)",
  house: "linear-gradient(135deg, #0d9488, #06b6d4)",
  action: "linear-gradient(135deg, #e11d48, #f43f5e)",
  bathroom: "linear-gradient(135deg, #7c3aed, #a855f7)",
  kitchen: "linear-gradient(135deg, #d97706, #f59e0b)",
  bodies: "linear-gradient(135deg, #059669, #10b981)",
  different: "linear-gradient(135deg, #334155, #64748b)",
  nature: "linear-gradient(135deg, #15803d, #22c55e)",
  seaside: "linear-gradient(135deg, #0369a1, #38bdf8)",
  whathouse: "linear-gradient(135deg, #c2410c, #f97316)"
};

function renderDesktopPlaylistGallery(categories) {
  const desktopGrid = document.getElementById("desktop-categories-grid");
  const totalCountBadge = document.getElementById("gallery-total-categories-badge");
  if (!desktopGrid) return;

  desktopGrid.innerHTML = "";
  if (totalCountBadge) {
    totalCountBadge.innerHTML = `<i class="fa-solid fa-layer-group"></i> ${categories.length} Playlists Available`;
  }

  categories.forEach(cat => {
    const vids = cat.enrichedVideos || [];
    const count = vids.length;
    const firstVid = vids[0];
    const thumbUrl = (firstVid && firstVid.thumbUrl) ? firstVid.thumbUrl : "https://img.youtube.com/vi/RJbUtcaoNCY/hqdefault.jpg";
    const levelStr = firstVid ? (firstVid.level || "A1") : "A1";

    // Build the 3 mini previews strip: displays Videos 2, 3, 4 (with Video 1 featured in the Hero above)
    let miniPreviewsHtml = "";
    for (let slot = 1; slot <= 3; slot++) {
      const mv = vids[slot];
      if (mv && mv.thumbUrl) {
        const num = (slot + 1) < 10 ? `0${slot + 1}` : `${slot + 1}`;
        const durBadge = mv.durationStr ? `<span class="yt-mini-badge">${mv.durationStr}</span>` : `<span class="yt-mini-badge">#${num}</span>`;
        miniPreviewsHtml += `
          <div class="yt-mini-thumb-item" data-mini-idx="${slot}" title="${escapeHtml(mv.title || 'Lesson ' + (slot + 1))}">
            <img src="${mv.thumbUrl}" alt="${escapeHtml(mv.title || '')}" loading="lazy" />
            ${durBadge}
          </div>
        `;
      } else {
        miniPreviewsHtml += `
          <div class="yt-mini-thumb-item yt-mini-empty-slot" title="Add Video">
            <i class="fa-solid fa-plus"></i>
            <span>Lesson ${slot + 1}</span>
          </div>
        `;
      }
    }

    const card = document.createElement("div");
    card.className = "yt-clean-playlist-card";
    card.setAttribute("data-category-id", cat.id);

    card.innerHTML = `
      <!-- Top 16:9 Hero Thumbnail -->
      <div class="yt-hero-preview-box">
        <img src="${thumbUrl}" alt="${escapeHtml(cat.title)}" class="yt-hero-img" loading="lazy" />
        <div class="yt-hero-cat-tag">
          <span>${cat.flag}</span> <span>${escapeHtml(cat.title)}</span>
        </div>
        <div class="yt-hero-count-badge">
          <i class="fa-solid fa-list-ul"></i> ${count} videos
        </div>
        <div class="yt-hero-hover-overlay">
          <div class="yt-play-all-circle">
            <i class="fa-solid fa-play"></i>
          </div>
          <span class="yt-play-all-text">PLAY ALL</span>
        </div>
      </div>

      <!-- Middle 3-Video Peek Strip -->
      <div class="yt-mini-previews-strip">
        ${miniPreviewsHtml}
      </div>

      <!-- Bottom Metadata & Title -->
      <div class="yt-card-bottom-info">
        <div class="yt-card-header-row">
          <h3 class="yt-card-clean-title">${cat.flag} ${escapeHtml(cat.title)}</h3>
          <button type="button" class="yt-card-options-btn" title="Add video to ${escapeHtml(cat.title)}">
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </button>
        </div>
        <div class="yt-card-sub-meta">
          <span>${count} Videos</span> • <span class="meta-highlight">Level ${levelStr}</span> • <span>Globally Known</span>
        </div>
        <div class="yt-card-action-bar">
          <span class="yt-card-action-link">
            <i class="fa-solid fa-circle-play"></i> Open Playlist
          </span>
          <span class="yt-card-arrow-pill">
            <i class="fa-solid fa-arrow-right"></i>
          </span>
        </div>
      </div>
    `;

    // Click on entire card opens playlist with first video
    card.addEventListener("click", () => {
      openDesktopPlaylistPage(cat);
    });

    // Clicking mini preview items opens that specific video directly
    card.querySelectorAll(".yt-mini-thumb-item[data-mini-idx]").forEach(miniItem => {
      miniItem.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = parseInt(miniItem.getAttribute("data-mini-idx"), 10);
        if (vids[idx]) {
          openDesktopPlaylistPage(cat, vids[idx]);
        } else {
          openDesktopPlaylistPage(cat);
        }
      });
    });

    // Clicking options button opens add video modal
    const optionsBtn = card.querySelector(".yt-card-options-btn");
    if (optionsBtn) {
      optionsBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openAddVideoModal(cat.id);
      });
    }

    desktopGrid.appendChild(card);
  });
}

function openDesktopPlaylistPage(cat, videoToPlay = null) {
  const galleryEl = document.getElementById("desktop-playlist-gallery");
  const playerPageEl = document.getElementById("desktop-video-player-page");
  const crumbEl = document.getElementById("desktop-player-category-crumb");
  const countPillEl = document.getElementById("desktop-player-cat-count-pill");
  const sidebarTitleEl = document.getElementById("desktop-sidebar-category-title");
  const itemsTrackEl = document.getElementById("desktop-playlist-items-track");
  const btnBack = document.getElementById("btn-desktop-back-to-gallery");
  const btnAddVideo = document.getElementById("btn-sidebar-add-video");

  if (!galleryEl || !playerPageEl) return;

  currentDesktopActiveCategory = cat;
  const vids = cat.enrichedVideos || [];

  galleryEl.classList.add("hidden");
  playerPageEl.classList.remove("hidden");

  if (crumbEl) crumbEl.textContent = `${cat.flag} ${cat.title}`;
  if (countPillEl) countPillEl.textContent = `${vids.length} Videos`;
  if (sidebarTitleEl) sidebarTitleEl.textContent = `${cat.flag} ${cat.title}`;

  if (btnBack) {
    btnBack.onclick = () => closeDesktopPlaylistPage();
  }

  if (btnAddVideo) {
    btnAddVideo.onclick = () => {
      openAddVideoModal(cat.id);
    };
  }

  // Populate Playlist Track
  if (itemsTrackEl) {
    itemsTrackEl.innerHTML = "";
    if (vids.length === 0) {
      itemsTrackEl.innerHTML = `
        <div style="padding: 1.5rem; text-align: center; color: #94a3b8; font-size: 0.88rem;">
          <i class="fa-solid fa-film" style="font-size: 1.8rem; margin-bottom: 0.5rem; display: block; opacity: 0.5;"></i>
          No videos in this playlist yet.<br>Click <strong>Embed New Video</strong> above to add one!
        </div>
      `;
    } else {
      vids.forEach((v, idx) => {
        const item = document.createElement("div");
        item.className = "sidebar-video-item";
        item.setAttribute("data-video-id", v.id);

        const lessonNum = (idx + 1) < 10 ? `0${idx + 1}` : `${idx + 1}`;
        item.innerHTML = `
          <div class="sidebar-item-thumb-box">
            <img src="${v.thumbUrl}" alt="${escapeHtml(v.title)}" loading="lazy" />
            <span class="sidebar-item-num-badge">#${lessonNum}</span>
            <span class="sidebar-item-duration">${v.durationStr}</span>
          </div>
          <div class="sidebar-item-info">
            <h4 class="sidebar-item-title" title="${escapeHtml(v.title)}">${escapeHtml(v.title)}</h4>
            <div class="sidebar-item-sub">
              <span class="video-level-pill ${v.level.toLowerCase()}" style="font-size: 0.65rem; padding: 1px 5px;">${v.level}</span>
              <span class="sidebar-playing-indicator"><i class="fa-solid fa-volume-high"></i> Playing</span>
            </div>
          </div>
        `;

        item.addEventListener("click", () => {
          loadDesktopCinemaVideo(v, cat, idx, item);
        });

        itemsTrackEl.appendChild(item);
      });
    }
  }

  // Determine starting video to play
  const targetVideo = videoToPlay || (vids.length > 0 ? vids[0] : null);
  const targetIdx = targetVideo ? vids.findIndex(v => v.id === targetVideo.id) : 0;
  const firstItemEl = itemsTrackEl ? itemsTrackEl.children[targetIdx >= 0 ? targetIdx : 0] : null;

  if (targetVideo) {
    loadDesktopCinemaVideo(targetVideo, cat, targetIdx >= 0 ? targetIdx : 0, firstItemEl);
  } else {
    clearDesktopCinemaPlayer();
  }

  // Smooth scroll up to top of panel-videos
  const panelVideos = document.getElementById("panel-videos");
  if (panelVideos) panelVideos.scrollIntoView({ behavior: "smooth", block: "start" });
}

function loadDesktopCinemaVideo(video, cat, index, itemEl) {
  if (!video) return;
  currentDesktopActiveVideo = video;

  const iframe = document.getElementById("desktop-cinema-iframe");
  const titleEl = document.getElementById("desktop-cinema-video-title");
  const levelPill = document.getElementById("desktop-cinema-level-pill");
  const durationPill = document.getElementById("desktop-cinema-duration-pill");
  const catPill = document.getElementById("desktop-cinema-cat-pill");
  const counterEl = document.getElementById("desktop-sidebar-progress-counter");
  const trackEl = document.getElementById("desktop-playlist-items-track");
  const adminActionsEl = document.getElementById("desktop-cinema-admin-actions");

  // Format clean embed URL with autoplay
  let activeEmbedUrl = video.embedUrl || "";
  if (activeEmbedUrl.includes("youtube") && !activeEmbedUrl.includes("videoseries")) {
    activeEmbedUrl = activeEmbedUrl.replace(/[?&]list=[a-zA-Z0-9_-]+/g, "");
    activeEmbedUrl = activeEmbedUrl.replace(/\?&/g, "?").replace(/\?$/g, "");
  }
  if (activeEmbedUrl.includes("youtube.com/embed/")) {
    activeEmbedUrl = activeEmbedUrl.replace("youtube.com/embed/", "youtube-nocookie.com/embed/");
  }
  if (activeEmbedUrl.includes("youtube-nocookie.com/embed/") || activeEmbedUrl.includes("youtube.com/embed/")) {
    if (!activeEmbedUrl.includes("fs=")) {
      activeEmbedUrl += (activeEmbedUrl.includes("?") ? "&" : "?") + "fs=1";
    }
    if (!activeEmbedUrl.includes("enablejsapi=")) {
      activeEmbedUrl += "&enablejsapi=1";
    }
    if (!activeEmbedUrl.includes("playsinline=")) {
      activeEmbedUrl += "&playsinline=1";
    }
    if (!activeEmbedUrl.includes("origin=")) {
      activeEmbedUrl += `&origin=${encodeURIComponent(window.location.origin)}`;
    }
  }
  const autoplayParam = activeEmbedUrl.includes("?") ? "&autoplay=1" : "?autoplay=1";
  if (iframe) iframe.src = activeEmbedUrl + autoplayParam;

  if (titleEl) titleEl.textContent = video.title || "Video Lesson";
  if (levelPill) {
    levelPill.textContent = `Level: ${video.level || "A1"}`;
    levelPill.className = `cinema-level-pill ${video.level ? video.level.toLowerCase() : 'a1'}`;
  }
  if (durationPill) durationPill.innerHTML = `<i class="fa-regular fa-clock" style="margin-right: 4px;"></i> ${video.durationStr || "12:00"}`;
  if (catPill) catPill.textContent = `${cat.flag} ${cat.title}`;

  const totalVids = cat.enrichedVideos ? cat.enrichedVideos.length : 1;
  if (counterEl) counterEl.textContent = `${index + 1} / ${totalVids}`;

  // Update active state in sidebar
  if (trackEl) {
    const allItems = trackEl.querySelectorAll(".sidebar-video-item");
    allItems.forEach(el => el.classList.remove("is-active"));
  }
  if (itemEl) {
    itemEl.classList.add("is-active");
    itemEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // Action buttons
  const btnSave = document.getElementById("btn-cinema-save-list");
  const btnVocab = document.getElementById("btn-cinema-vocab");
  const btnShare = document.getElementById("btn-cinema-share");
  if (btnSave) {
    btnSave.onclick = () => showToast(`⭐ "${video.title}" saved to your Immersion List!`);
  }
  if (btnVocab) {
    btnVocab.onclick = () => showToast(`📚 Key Vocabulary for "${video.title}" saved to your study notes!`);
  }
  if (btnShare) {
    btnShare.onclick = () => {
      if (video.embedUrl && navigator.clipboard) {
        navigator.clipboard.writeText(video.embedUrl);
        showToast("🔗 Video link copied to clipboard!");
      } else {
        showToast("🔗 Video ready to share!");
      }
    };
  }

  // Admin edit / delete buttons if video is user added or in admin mode
  if (adminActionsEl) {
    adminActionsEl.innerHTML = "";
    const isEditAllowed = typeof isAdminUnlocked === "function" && isAdminUnlocked();
    if (isEditAllowed || video.isUserAdded) {
      const editBtn = document.createElement("button");
      editBtn.className = "cinema-btn";
      editBtn.style.padding = "6px 12px";
      editBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Edit';
      editBtn.onclick = () => openEditVideoModal(video);
      adminActionsEl.appendChild(editBtn);

      if (video.isUserAdded) {
        const delBtn = document.createElement("button");
        delBtn.className = "cinema-btn";
        delBtn.style.padding = "6px 12px";
        delBtn.style.color = "#f87171";
        delBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i> Delete';
        delBtn.onclick = () => handleDeleteUserVideo(video.id);
        adminActionsEl.appendChild(delBtn);
      }
    }
  }

  // Immersion streak reward
  let currentMins = parseInt(localStorage.getItem("sol_immersion_today_mins") || "18", 10);
  currentMins += 5;
  localStorage.setItem("sol_immersion_today_mins", currentMins.toString());
  const streakMinsEl = document.getElementById("streak-minutes-today");
  if (streakMinsEl) streakMinsEl.textContent = `${currentMins} mins`;
}

function clearDesktopCinemaPlayer() {
  const iframe = document.getElementById("desktop-cinema-iframe");
  const titleEl = document.getElementById("desktop-cinema-video-title");
  if (iframe) iframe.src = "";
  if (titleEl) titleEl.textContent = "No videos in this playlist yet";
}

function closeDesktopPlaylistPage() {
  const iframe = document.getElementById("desktop-cinema-iframe");
  if (iframe) iframe.src = "";
  const galleryEl = document.getElementById("desktop-playlist-gallery");
  const playerPageEl = document.getElementById("desktop-video-player-page");
  if (playerPageEl) playerPageEl.classList.add("hidden");
  if (galleryEl) galleryEl.classList.remove("hidden");
}

// -------------------------------------------------------------
// Mobile Synapse Video Platform (2-Stage Mobile Experience)
// -------------------------------------------------------------
let currentMobileActiveCategory = null;
let currentMobileActiveVideo = null;

function renderMobilePlaylistGallery(categories) {
  const mobList = document.getElementById("mobile-playlists-list");
  const countBadge = document.getElementById("mobile-total-playlists-badge");
  const searchInput = document.getElementById("mobile-playlist-search-input");
  if (!mobList) return;

  if (countBadge) {
    countBadge.textContent = `${categories.length} Playlists`;
  }

  const buildItems = (filterText = "") => {
    mobList.innerHTML = "";
    const query = filterText.toLowerCase().trim();

    const filtered = categories.filter(c => {
      if (!query) return true;
      const t = (c.title || "").toLowerCase();
      const catId = (c.id || "").toLowerCase();
      return t.includes(query) || catId.includes(query);
    });

    if (filtered.length === 0) {
      mobList.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: #94a3b8; font-size: 0.85rem;">
          <i class="fa-solid fa-search" style="font-size: 1.5rem; margin-bottom: 0.5rem; display: block; opacity: 0.5;"></i>
          No playlists matching "${escapeHtml(filterText)}"
        </div>
      `;
      return;
    }

    filtered.forEach(cat => {
      const vids = cat.enrichedVideos || [];
      const count = vids.length;
      const firstVid = vids[0];
      const thumbUrl = (firstVid && firstVid.thumbUrl) ? firstVid.thumbUrl : "https://img.youtube.com/vi/RJbUtcaoNCY/hqdefault.jpg";
      const levelStr = firstVid ? (firstVid.level || "A1") : "A1";

      const card = document.createElement("div");
      card.className = "mob-playlist-card";
      card.setAttribute("data-category-id", cat.id);

      card.innerHTML = `
        <div class="mob-card-thumb-wrap">
          <img src="${thumbUrl}" alt="${escapeHtml(cat.title)}" class="mob-card-thumb-img" loading="lazy" />
          <div class="mob-card-deck-layer"></div>
          <span class="mob-card-badge"><i class="fa-solid fa-layer-group"></i> ${count}</span>
        </div>
        <div class="mob-card-info-col">
          <h3 class="mob-card-title">${cat.flag} ${escapeHtml(cat.title)}</h3>
          <span class="mob-card-count">${count} Videos</span>
          <span class="mob-card-curator">By Globally Known • Level ${levelStr}</span>
        </div>
        <i class="fa-solid fa-chevron-right mob-card-arrow"></i>
      `;

      card.addEventListener("click", () => {
        openMobilePlaylistPage(cat);
      });

      mobList.appendChild(card);
    });
  };

  buildItems(searchInput ? searchInput.value : "");

  if (searchInput && !searchInput.dataset.listening) {
    searchInput.dataset.listening = "true";
    searchInput.addEventListener("input", (e) => {
      buildItems(e.target.value);
    });
  }
}

function openMobilePlaylistPage(cat, videoToPlay = null) {
  const galleryEl = document.getElementById("mobile-playlist-gallery");
  const playerPageEl = document.getElementById("mobile-video-player-page");
  const catTitleEl = document.getElementById("mobile-player-cat-title");
  const sectionNameEl = document.getElementById("mobile-section-playlist-name");
  const itemsListEl = document.getElementById("mobile-playlist-items-list");
  const btnBack = document.getElementById("btn-mobile-back-to-gallery");
  const btnHeaderAdd = document.getElementById("btn-mobile-header-add");
  const btnActionEmbed = document.getElementById("btn-mobile-embed-video");
  const btnActionSave = document.getElementById("btn-mobile-save-list");
  const btnActionShare = document.getElementById("btn-mobile-share-vid");

  if (!galleryEl || !playerPageEl) return;

  currentMobileActiveCategory = cat;
  const vids = cat.enrichedVideos || [];

  galleryEl.classList.add("hidden");
  playerPageEl.classList.remove("hidden");

  if (catTitleEl) catTitleEl.textContent = `${cat.flag} ${cat.title}`;
  if (sectionNameEl) sectionNameEl.textContent = `${cat.flag} ${cat.title}`;

  if (btnBack) {
    btnBack.onclick = () => closeMobilePlaylistPage();
  }

  const btnActionRotate = document.getElementById("btn-mobile-rotate-landscape");
  if (btnActionRotate) {
    btnActionRotate.onclick = () => toggleMobileLandscapeFullscreen();
  }
  const btnExitPseudo = document.getElementById("btn-exit-pseudo-landscape");
  if (btnExitPseudo) {
    btnExitPseudo.onclick = () => toggleMobileLandscapeFullscreen(false);
  }

  const handleOpenAddModal = () => {
    openAddVideoModal(cat.id);
  };
  if (btnHeaderAdd) btnHeaderAdd.onclick = handleOpenAddModal;
  if (btnActionEmbed) btnActionEmbed.onclick = handleOpenAddModal;

  if (btnActionSave) {
    btnActionSave.onclick = () => {
      if (currentMobileActiveVideo) {
        showToast(`⭐ Saved "${currentMobileActiveVideo.title}" to your study list!`);
      } else {
        showToast(`⭐ Saved "${cat.title}" playlist!`);
      }
    };
  }

  if (btnActionShare) {
    btnActionShare.onclick = () => {
      if (navigator.share && currentMobileActiveVideo) {
        navigator.share({
          title: currentMobileActiveVideo.title,
          text: `Check out this lesson in ${cat.title} on Globally Known!`,
          url: window.location.href
        }).catch(() => {});
      } else {
        showToast(`🔗 Link copied to clipboard!`);
      }
    };
  }

  // Populate Mobile Playlist Video List
  if (itemsListEl) {
    itemsListEl.innerHTML = "";
    if (vids.length === 0) {
      itemsListEl.innerHTML = `
        <div style="padding: 1.5rem; text-align: center; color: #94a3b8; font-size: 0.82rem;">
          <i class="fa-solid fa-film" style="font-size: 1.6rem; margin-bottom: 0.5rem; display: block; opacity: 0.5;"></i>
          No videos in this playlist yet.<br>Tap <strong>Embed Video</strong> above to add one!
        </div>
      `;
    } else {
      vids.forEach((v, idx) => {
        const item = document.createElement("div");
        item.className = "mob-playlist-item";
        item.setAttribute("data-video-id", v.id);

        item.innerHTML = `
          <div class="mob-item-thumb-box">
            <img src="${v.thumbUrl}" alt="${escapeHtml(v.title)}" loading="lazy" />
            <span class="mob-item-badge">${v.durationStr}</span>
          </div>
          <div class="mob-item-info">
            <h4 class="mob-item-title" title="${escapeHtml(v.title)}">${escapeHtml(v.title)}</h4>
            <div class="mob-item-sub">
              <span>Level ${v.level}</span>
              <span class="mob-playing-tag"><i class="fa-solid fa-volume-high"></i> Playing</span>
            </div>
          </div>
        `;

        item.addEventListener("click", () => {
          loadMobileCinemaVideo(v, cat, idx, item);
        });

        itemsListEl.appendChild(item);
      });
    }
  }

  // Initial video to play
  const targetVideo = videoToPlay || (vids.length > 0 ? vids[0] : null);
  const targetIdx = targetVideo ? vids.findIndex(v => v.id === targetVideo.id) : 0;
  const firstItemEl = itemsListEl ? itemsListEl.children[targetIdx >= 0 ? targetIdx : 0] : null;

  if (targetVideo) {
    loadMobileCinemaVideo(targetVideo, cat, targetIdx >= 0 ? targetIdx : 0, firstItemEl);
  } else {
    clearMobileCinemaPlayer();
  }

  // Smooth scroll up to mobile player
  playerPageEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

function loadMobileCinemaVideo(video, cat, index, itemEl) {
  if (!video) return;
  currentMobileActiveVideo = video;

  const iframe = document.getElementById("mobile-cinema-iframe");
  const titleEl = document.getElementById("mobile-active-video-title");
  const levelPill = document.getElementById("mobile-active-level-pill");
  const durationPill = document.getElementById("mobile-active-duration-pill");
  const counterEl = document.getElementById("mobile-section-playlist-counter");
  const itemsListEl = document.getElementById("mobile-playlist-items-list");

  if (titleEl) titleEl.textContent = video.title;
  if (levelPill) levelPill.textContent = `Level: ${video.level || "A1"}`;
  if (durationPill) durationPill.textContent = video.durationStr || "12:00";

  const totalCount = cat.enrichedVideos ? cat.enrichedVideos.length : 1;
  if (counterEl) counterEl.textContent = `${index + 1} / ${totalCount}`;

  // Embed URL with autoplay
  if (iframe) {
    let activeEmbedUrl = video.embedUrl || "";
    if (activeEmbedUrl.includes("youtube") && !activeEmbedUrl.includes("videoseries")) {
      activeEmbedUrl = activeEmbedUrl.replace(/[?&]list=[a-zA-Z0-9_-]+/g, "");
      activeEmbedUrl = activeEmbedUrl.replace(/\?&/g, "?").replace(/\?$/g, "");
    }
    if (activeEmbedUrl.includes("youtube.com/embed/")) {
      activeEmbedUrl = activeEmbedUrl.replace("youtube.com/embed/", "youtube-nocookie.com/embed/");
    }
    if (activeEmbedUrl.includes("youtube-nocookie.com/embed/") || activeEmbedUrl.includes("youtube.com/embed/")) {
      if (!activeEmbedUrl.includes("fs=")) {
        activeEmbedUrl += (activeEmbedUrl.includes("?") ? "&" : "?") + "fs=1";
      }
      if (!activeEmbedUrl.includes("enablejsapi=")) {
        activeEmbedUrl += "&enablejsapi=1";
      }
      if (!activeEmbedUrl.includes("playsinline=")) {
        activeEmbedUrl += "&playsinline=1";
      }
      if (!activeEmbedUrl.includes("origin=")) {
        activeEmbedUrl += `&origin=${encodeURIComponent(window.location.origin)}`;
      }
    }
    const autoplayParam = activeEmbedUrl.includes("?") ? "&autoplay=1" : "?autoplay=1";
    iframe.src = activeEmbedUrl + autoplayParam;
  }

  // Active class toggle
  if (itemsListEl) {
    Array.from(itemsListEl.children).forEach(c => c.classList.remove("is-active"));
  }
  if (itemEl) {
    itemEl.classList.add("is-active");
  }

  // Immersion streak reward
  let currentMins = parseInt(localStorage.getItem("sol_immersion_today_mins") || "18", 10);
  currentMins += 5;
  localStorage.setItem("sol_immersion_today_mins", currentMins.toString());
  const streakMinsEl = document.getElementById("streak-minutes-today");
  if (streakMinsEl) streakMinsEl.textContent = `${currentMins} mins`;
}

function clearMobileCinemaPlayer() {
  const iframe = document.getElementById("mobile-cinema-iframe");
  const titleEl = document.getElementById("mobile-active-video-title");
  if (iframe) iframe.src = "";
  if (titleEl) titleEl.textContent = "No videos in this playlist yet";
}

function closeMobilePlaylistPage() {
  const iframe = document.getElementById("mobile-cinema-iframe");
  if (iframe) iframe.src = "";
  const wrapper = document.getElementById("mobile-cinema-iframe-wrapper");
  if (wrapper) wrapper.classList.remove("is-pseudo-landscape");
  unlockScreenOrientation();
  const galleryEl = document.getElementById("mobile-playlist-gallery");
  const playerPageEl = document.getElementById("mobile-video-player-page");
  if (playerPageEl) playerPageEl.classList.add("hidden");
  if (galleryEl) galleryEl.classList.remove("hidden");
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

  // 1. Initialize Top Immersion Ribbon & Monetization Bar
  const streakDaysEl = document.getElementById("streak-days-count");
  const streakMinsEl = document.getElementById("streak-minutes-today");
  const tierStatusPill = document.getElementById("tier-status-pill");
  const btnUnlockPro = document.getElementById("btn-unlock-pro");
  const btnClosePro = document.getElementById("btn-close-pro-upgrade");
  const btnDismissPro = document.getElementById("btn-dismiss-pro-upgrade");
  const btnConfirmPro = document.getElementById("btn-confirm-pro-membership");

  const activeStreak = localStorage.getItem("sol_immersion_streak") || "5";
  const activeMins = localStorage.getItem("sol_immersion_today_mins") || "18";
  if (streakDaysEl) streakDaysEl.innerHTML = `<i class="fa-solid fa-fire text-amber-400"></i> ${activeStreak} Days`;
  if (streakMinsEl) streakMinsEl.textContent = `${activeMins} mins`;

  const userIsPro = isProMember();
  if (tierStatusPill) {
    if (userIsPro) {
      tierStatusPill.innerHTML = `<i class="fa-solid fa-crown text-amber-400"></i> PRO Member`;
      tierStatusPill.classList.add("active-pro-pill");
    } else {
      tierStatusPill.textContent = "Free Member";
      tierStatusPill.classList.remove("active-pro-pill");
    }
  }
  if (btnUnlockPro) {
    if (userIsPro) {
      btnUnlockPro.innerHTML = `<i class="fa-solid fa-gem mr-1"></i> PRO Active`;
      btnUnlockPro.classList.add("active-pro-btn");
    } else {
      btnUnlockPro.innerHTML = `<i class="fa-solid fa-crown mr-1"></i> Unlock Unlimited PRO`;
      btnUnlockPro.classList.remove("active-pro-btn");
    }
    btnUnlockPro.onclick = () => openProUpgradeModal();
  }
  if (btnClosePro) btnClosePro.onclick = () => closeProUpgradeModal();
  if (btnDismissPro) btnDismissPro.onclick = () => closeProUpgradeModal();
  if (btnConfirmPro) {
    btnConfirmPro.onclick = () => {
      localStorage.setItem("sol_is_pro_member", "true");
      closeProUpgradeModal();
      showToast("👑 Welcome to SOL Immersion PRO! All lessons unlocked.");
      initVideosPanel();
    };
  }

  // 2. Initialize Quick Filter Chips
  const filterChips = document.querySelectorAll(".filter-chip");
  filterChips.forEach(chip => {
    chip.onclick = () => {
      filterChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const filter = chip.getAttribute("data-filter") || "all";

      const allCards = videoGrid.querySelectorAll(".video-card");
      allCards.forEach(card => {
        if (card.classList.contains("add-video-card")) {
          card.style.display = "flex";
          return;
        }
        if (filter === "all") {
          card.style.display = "flex";
        } else if (filter === "vip") {
          card.style.display = card.classList.contains("vip-card") ? "flex" : "none";
        } else {
          card.style.display = (card.getAttribute("data-level") === filter) ? "flex" : "none";
        }
      });
    };
  });

  // Theater Modal Open Helper
  function openTheaterModal(video, category) {
    if (!playlistModal || !mainPlaylistIframe) return;

    let activeEmbedUrl = video.embedUrl || "";
    if (activeEmbedUrl.includes("youtube") && !activeEmbedUrl.includes("videoseries")) {
      activeEmbedUrl = activeEmbedUrl.replace(/[?&]list=[a-zA-Z0-9_-]+/g, "");
      activeEmbedUrl = activeEmbedUrl.replace(/\?&/g, "?").replace(/\?$/g, "");
    }
    if (activeEmbedUrl.includes("youtube.com/embed/")) {
      activeEmbedUrl = activeEmbedUrl.replace("youtube.com/embed/", "youtube-nocookie.com/embed/");
    }
    if (activeEmbedUrl.includes("youtube-nocookie.com/embed/") || activeEmbedUrl.includes("youtube.com/embed/")) {
      if (!activeEmbedUrl.includes("fs=")) {
        activeEmbedUrl += (activeEmbedUrl.includes("?") ? "&" : "?") + "fs=1";
      }
    }
    const autoplayParam = activeEmbedUrl.includes("?") ? "&autoplay=1" : "?autoplay=1";
    mainPlaylistIframe.src = activeEmbedUrl + autoplayParam;

    const playlistTitle = document.getElementById("playlist-title");
    const playlistDesc = document.getElementById("playlist-desc");
    if (playlistTitle) playlistTitle.textContent = video.title || "Video Lesson";
    if (playlistDesc) {
      const catText = category ? `${category.flag} ${category.title}` : "Comprehensible Input";
      playlistDesc.textContent = `${catText} • Level: ${video.level || "A2"} • Graded Natural Acquisition`;
    }

    playlistModal.classList.remove("hidden");

    // Add +5 mins to immersion streak
    let currentMins = parseInt(localStorage.getItem("sol_immersion_today_mins") || "18", 10);
    currentMins += 5;
    localStorage.setItem("sol_immersion_today_mins", currentMins.toString());
    if (streakMinsEl) streakMinsEl.textContent = `${currentMins} mins`;
  }

  let firstEnrichedVideo = null;
  let firstCategory = null;

  uniqueCategories.forEach(category => {
    const customForCategory = userAddedVideos.filter(v => v.categoryId === category.id);
    const enrichedCustom = customForCategory.map((v, i) => enrichVideoMetadata(v, i));
    category.enrichedVideos = enrichedCustom;
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
    const indicatorsContainer = row.querySelector(`#netflix-indicators-${category.id}`);

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

    category.videos.forEach((rawVideo, idx) => {
      if (rawVideo.isAddTemplate) {
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

      const video = enrichVideoMetadata(rawVideo, idx);
      const isCardLocked = video.isVip && !userIsPro;

      if (!firstEnrichedVideo) {
        firstEnrichedVideo = video;
        firstCategory = category;
      }

      const card = document.createElement("div");
      card.className = `video-card ${video.isVip ? "vip-card" : ""}`;
      card.setAttribute("data-video-id", video.id);
      card.setAttribute("data-level", video.level.toLowerCase());

      card.innerHTML = `
        <div class="video-poster-container">
          <img src="${video.thumbUrl}" alt="${escapeHtml(video.title)}" class="video-poster-img" loading="lazy" />
          <span class="video-level-pill ${video.level.toLowerCase()}">${video.level}</span>
          <span class="video-duration-pill">${video.durationStr}</span>
          ${isCardLocked ? `
            <span class="video-vip-badge"><i class="fa-solid fa-crown"></i> PRO</span>
            <div class="video-vip-lock-overlay">
              <div class="lock-icon-circle"><i class="fa-solid fa-lock"></i></div>
              <span class="lock-label">Member Exclusive</span>
            </div>
          ` : `
            <div class="video-play-overlay">
              <div class="play-btn-circle">
                <i class="fa-solid fa-play"></i>
              </div>
            </div>
          `}
        </div>
        <div class="video-card-info-footer">
          <div class="video-card-title-row">
            <h4 class="video-card-title" title="${escapeHtml(video.title)}">${escapeHtml(video.title)}</h4>
            <div class="video-card-actions">
              <button class="edit-video-btn mini" data-id="${video.id}" title="Edit Video Title"><i class="fa-solid fa-pen"></i></button>
              ${video.isUserAdded ? `<button class="delete-video-btn mini" data-id="${video.id}" title="Delete Video"><i class="fa-solid fa-trash-can"></i></button>` : ""}
            </div>
          </div>
          <div class="video-card-sub-row">
            <span class="video-rating-pill"><i class="fa-solid fa-star"></i> 4.9</span>
            <span class="video-status-text ${video.isVip ? 'is-vip' : ''}">
              ${isCardLocked ? '<i class="fa-solid fa-lock" style="font-size: 10px;"></i> Unlock with PRO' : '<i class="fa-solid fa-circle-check" style="font-size: 10px; color: #34d399;"></i> Free Lesson'}
            </span>
          </div>
        </div>
      `;

      // Click card to play or open upgrade
      card.addEventListener("click", () => {
        if (isCardLocked) {
          openProUpgradeModal();
        } else {
          openTheaterModal(video, category);
        }
      });

      const editBtn = card.querySelector(".edit-video-btn.mini");
      if (editBtn) {
        editBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          openEditVideoModal(video);
        });
      }

      const titleEl = card.querySelector(".video-card-title");
      if (titleEl) {
        titleEl.addEventListener("dblclick", (e) => {
          e.stopPropagation();
          openEditVideoModal(video);
        });
      }

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

  // 3. Render Desktop & Mobile Synapse Platforms
  renderDesktopPlaylistGallery(uniqueCategories);
  renderMobilePlaylistGallery(uniqueCategories);

  // If a category was already open on desktop, refresh its player view
  if (currentDesktopActiveCategory) {
    const updatedCat = uniqueCategories.find(c => c.id === currentDesktopActiveCategory.id);
    if (updatedCat) {
      currentDesktopActiveCategory = updatedCat;
      const targetVid = currentDesktopActiveVideo ? (updatedCat.enrichedVideos.find(v => v.id === currentDesktopActiveVideo.id) || updatedCat.enrichedVideos[0]) : updatedCat.enrichedVideos[0];
      const playerPageEl = document.getElementById("desktop-video-player-page");
      if (playerPageEl && !playerPageEl.classList.contains("hidden")) {
        openDesktopPlaylistPage(updatedCat, targetVid);
      }
    }
  }

  // If a category was already open on mobile, refresh its player view
  if (currentMobileActiveCategory) {
    const updatedMobCat = uniqueCategories.find(c => c.id === currentMobileActiveCategory.id);
    if (updatedMobCat) {
      currentMobileActiveCategory = updatedMobCat;
      const targetVid = currentMobileActiveVideo ? (updatedMobCat.enrichedVideos.find(v => v.id === currentMobileActiveVideo.id) || updatedMobCat.enrichedVideos[0]) : updatedMobCat.enrichedVideos[0];
      const mobPlayerPageEl = document.getElementById("mobile-video-player-page");
      if (mobPlayerPageEl && !mobPlayerPageEl.classList.contains("hidden")) {
        openMobilePlaylistPage(updatedMobCat, targetVid);
      }
    }
  }

  // 4. Populate Spotlight Hero Banner
  if (firstEnrichedVideo) {
    const spotlightTitle = document.getElementById("spotlight-title");
    const spotlightLevel = document.getElementById("spotlight-level-pill");
    const spotlightDuration = document.getElementById("spotlight-duration-pill");
    const spotlightBackdrop = document.getElementById("spotlight-hero-backdrop");
    const btnSpotlightWatch = document.getElementById("btn-spotlight-watch");
    const btnSpotlightSave = document.getElementById("btn-spotlight-save");
    const btnSpotlightVocab = document.getElementById("btn-spotlight-vocab");

    if (spotlightTitle) spotlightTitle.textContent = firstEnrichedVideo.title;
    if (spotlightLevel) spotlightLevel.textContent = `Level: ${firstEnrichedVideo.level} Elementary`;
    if (spotlightDuration) spotlightDuration.innerHTML = `<i class="fa-regular fa-clock" style="margin-right: 4px;"></i> ${firstEnrichedVideo.durationStr}`;
    if (spotlightBackdrop && firstEnrichedVideo.thumbUrl) {
      spotlightBackdrop.style.backgroundImage = `linear-gradient(to top, rgba(11, 17, 32, 0.95) 15%, rgba(11, 17, 32, 0.6) 60%, rgba(11, 17, 32, 0.3) 100%), url('${firstEnrichedVideo.thumbUrl}')`;
      spotlightBackdrop.style.backgroundSize = "cover";
      spotlightBackdrop.style.backgroundPosition = "center";
    }

    if (btnSpotlightWatch) {
      btnSpotlightWatch.onclick = () => openTheaterModal(firstEnrichedVideo, firstCategory);
    }
    if (btnSpotlightSave) {
      btnSpotlightSave.onclick = () => showToast(`⭐ "${firstEnrichedVideo.title}" added to your Immersion List!`);
    }
    if (btnSpotlightVocab) {
      btnSpotlightVocab.onclick = () => showToast(`📚 Key Vocabulary for "${firstEnrichedVideo.title}" saved to your study deck!`);
    }
  }

  // 5. Theater Modal Close Handlers
  if (btnClosePlaylistModal) {
    btnClosePlaylistModal.addEventListener("click", () => {
      if (playlistModal) playlistModal.classList.add("hidden");
      if (mainPlaylistIframe) mainPlaylistIframe.src = "";
    });
  }
  if (playlistModal) {
    playlistModal.addEventListener("click", (e) => {
      if (e.target === playlistModal) {
        playlistModal.classList.add("hidden");
        if (mainPlaylistIframe) mainPlaylistIframe.src = "";
      }
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

  // Saved Lists: check localStorage first for active user, else fetch default
  let loadedLists = null;
  const savingsKey = getActiveUserStorageKey("sol_savings_lists");
  try {
    const local = localStorage.getItem(savingsKey);
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

  // History from localStorage for active user
  const historyKey = getActiveUserStorageKey("sol_rwggp_history");
  try {
    const hist = localStorage.getItem(historyKey);
    rwggpHistory = hist ? JSON.parse(hist) : [];
  } catch (e) {
    rwggpHistory = [];
  }
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
      const historyKey = getActiveUserStorageKey("sol_rwggp_history");
      localStorage.setItem(historyKey, JSON.stringify(rwggpHistory));
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
    const savingsKey = getActiveUserStorageKey("sol_savings_lists");
    localStorage.setItem(savingsKey, JSON.stringify(rwggpSavingLists));
  } catch (e) {}

  // Sync to backend progress per user
  try {
    const profile = getActiveUserProfile();
    const userEmail = (profile && profile.email) ? profile.email : "guest";
    fetch(`/api/progress?email=${encodeURIComponent(userEmail)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, saving_lists: rwggpSavingLists, history: rwggpHistory })
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

// =========================================================================
// Universal Fullscreen & Automatic Screen Orientation Manager
// =========================================================================
async function lockScreenToLandscape() {
  try {
    if (screen.orientation && typeof screen.orientation.lock === "function") {
      await screen.orientation.lock("landscape").catch(async () => {
        await screen.orientation.lock("landscape-primary").catch(() => {});
      });
    } else if (screen.lockOrientation) {
      screen.lockOrientation("landscape");
    } else if (screen.webkitLockOrientation) {
      screen.webkitLockOrientation("landscape");
    } else if (screen.mozLockOrientation) {
      screen.mozLockOrientation("landscape");
    } else if (screen.msLockOrientation) {
      screen.msLockOrientation("landscape");
    }
  } catch (err) {
    console.debug("[Orientation] Lock failed:", err);
  }
}

function unlockScreenOrientation() {
  try {
    if (screen.orientation && typeof screen.orientation.unlock === "function") {
      screen.orientation.unlock();
    } else if (screen.unlockOrientation) {
      screen.unlockOrientation();
    } else if (screen.webkitUnlockOrientation) {
      screen.webkitUnlockOrientation();
    } else if (screen.mozUnlockOrientation) {
      screen.mozUnlockOrientation();
    } else if (screen.msUnlockOrientation) {
      screen.msUnlockOrientation();
    }
  } catch (err) {
    console.debug("[Orientation] Unlock failed:", err);
  }
}

function isElementFullscreen() {
  return !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );
}

function handleUniversalFullscreenChange() {
  const isFs = isElementFullscreen();
  const wrapper = document.getElementById("mobile-cinema-iframe-wrapper");
  if (isFs) {
    lockScreenToLandscape();
  } else {
    unlockScreenOrientation();
    if (wrapper && wrapper.classList.contains("is-pseudo-landscape")) {
      wrapper.classList.remove("is-pseudo-landscape");
    }
  }
}

async function toggleMobileLandscapeFullscreen(forceState = null) {
  const wrapper = document.getElementById("mobile-cinema-iframe-wrapper");
  const iframe = document.getElementById("mobile-cinema-iframe");
  const target = wrapper || iframe;
  if (!target) return;

  const isFs = isElementFullscreen();
  const isPseudo = wrapper && wrapper.classList.contains("is-pseudo-landscape");
  const shouldOpen = forceState !== null ? forceState : (!isFs && !isPseudo);

  if (shouldOpen) {
    // 1. Try standard Fullscreen API
    let fsSuccess = false;
    try {
      if (target.requestFullscreen) {
        await target.requestFullscreen();
        fsSuccess = true;
      } else if (target.webkitRequestFullscreen) {
        await target.webkitRequestFullscreen();
        fsSuccess = true;
      } else if (iframe && iframe.requestFullscreen) {
        await iframe.requestFullscreen();
        fsSuccess = true;
      } else if (iframe && iframe.webkitRequestFullscreen) {
        await iframe.webkitRequestFullscreen();
        fsSuccess = true;
      }
    } catch (e) {
      console.debug("Fullscreen request notice:", e);
    }

    // 2. Lock screen orientation
    await lockScreenToLandscape();

    // 3. Fallback for iOS or environments where orientation lock is restricted:
    if (!isElementFullscreen()) {
      if (wrapper) {
        wrapper.classList.add("is-pseudo-landscape");
        showToast("🔄 Rotated to Cinema Landscape (tap Rotate to exit)");
      }
    }
  } else {
    // Exit landscape & fullscreen
    if (wrapper) wrapper.classList.remove("is-pseudo-landscape");
    if (isElementFullscreen()) {
      if (document.exitFullscreen) {
        await document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen().catch(() => {});
      }
    }
    unlockScreenOrientation();
  }
}

// Global Fullscreen Event Listeners across all standard & vendor prefixes
["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"].forEach((evtName) => {
  document.addEventListener(evtName, handleUniversalFullscreenChange, false);
});

// YouTube Iframe API Fullscreen Event Bridge via postMessage
window.addEventListener("message", (e) => {
  try {
    let payload = e.data;
    if (typeof payload === "string") {
      try { payload = JSON.parse(payload); } catch (_) {}
    }
    if (payload && typeof payload === "object") {
      if (payload.info && typeof payload.info.fullscreen === "boolean") {
        if (payload.info.fullscreen) {
          lockScreenToLandscape();
        } else {
          unlockScreenOrientation();
        }
      }
      if (payload.event === "onFullscreenChange") {
        if (payload.info === true || payload.data === true) {
          lockScreenToLandscape();
        } else {
          unlockScreenOrientation();
        }
      }
    }
  } catch (_) {}
});

// Start SOL Engine safely after entire module has been fully parsed & evaluated
if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
