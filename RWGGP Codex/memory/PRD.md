# Random Word Generator — Color Vowel Chart (Karen Taylor)

## Problem statement
A full-stack app (React + FastAPI + MongoDB) that generates random words colored by their Color Vowel category, underlines the stressed vowel, shows the phonetic sound and a colloquial definition, supports word history + custom "Savings" lists, a global background Metronome (40–220 BPM, time signatures incl. 5/8), and a visual Color Vowel Chart. Forced light mode. User is highly sensitive to exact visual fidelity — do NOT proactively change colors/styles.

## Architecture
- Frontend: /app/frontend/src (App.js + components/, services/api.js)
- Backend: /app/backend (server.py, routes/words.py, categories.py, savings.py, models.py, seed_data.py)
- DB collections: words (2978), categories (16: incl. RED DRESS), saving_lists
- Key endpoints: GET /api/words/random, GET /api/words/category/{name}, GET/POST /api/savings/lists, POST /api/savings/lists/{id}/words

## Implemented (latest: June/July 2026)
- Color Vowel Chart now renders the user's latest reference chart (frontend/public/color-vowel-chart.png — IPA symbols, underlined stressed vowels, RED DRESS/TURQOISE TOY labels) inside ColorVowelLegend.jsx, responsive.
- Renamed RED PEPPER -> RED DRESS everywhere (DB categories + all 498 words already use RED DRESS).
- Code-review pass (verified by testing_agent, iteration_1.json — backend & frontend 100%, zero console errors):
  - Backend: /api/words/random now uses secrets.randbelow instead of random.randint.
  - React hook deps: loadSavedWords/loadLists/refreshLists/loadWords wrapped in useCallback with correct useEffect dependency arrays (App.js, Savings.jsx, SaveWordModal.jsx, CategoryWordsModal.jsx, WordDisplay.jsx).
  - Stable React keys: WordHistory (word+index), Savings/CategoryWordsModal (wordItem.word), Metronome beat markers (beat-i).
  - Fixed invalid nested <button> in Savings header (now div role=button) — cleared the hydration console error.
- NOT done (intentionally, to avoid regressions): Metronome audio-hook refactor (global audio context is fragile per handoff), and large complexity refactors of one-off scripts generate_3000_words*.py / words.py definition parsing (no runtime/product value, high risk).

## Backlog / Next
- P1: Make the chart clickable again (clicking a category opens CategoryWordsModal). Now that it's a single image, this needs an image-map / clickable overlay regions. Currently intentionally unclickable per user.
- P2: Refactor large App.js; simplify ColorVowelLegend (now trivial — image only).
- Known/Blocked: Underlines on light text (SILVER PIN, WHITE TIE) hard to see — user banned proactive color changes; do not touch unless asked.

## Notes for next agent
- Respond in English only.
- Reference chart image source asset: 14li5s8z_43748.jpg (white-bg, 1126x702).
- Metronome uses globalAudioContext in Metronome.jsx — don't break it.
- No 3rd-party API keys; no credentials needed for testing.
