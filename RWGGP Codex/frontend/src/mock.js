// Mock data for Color Vowel Chart Word Generator

export const colorVowelChart = [
  { name: 'GREEN TEA', color: '#2D8659', sound: '/iy/', keywords: ['bee', 'see', 'team'] },
  { name: 'RED PEPPER', color: '#DC2626', sound: '/ɛ/', keywords: ['red', 'bed', 'said'] },
  { name: 'SILVER PIN', color: '#9CA3AF', sound: '/ɪ/', keywords: ['it', 'sit', 'big'] },
  { name: 'PURPLE SHIRT', color: '#7C3AED', sound: '/ɜr/', keywords: ['bird', 'her', 'work'] },
  { name: 'BROWN COW', color: '#92400E', sound: '/aʊ/', keywords: ['now', 'how', 'cloud'] },
  { name: 'WHITE TIE', color: '#E5E7EB', sound: '/aɪ/', keywords: ['my', 'time', 'fly'] },
  { name: 'BLACK CAT', color: '#1F2937', sound: '/æ/', keywords: ['cat', 'bad', 'hand'] },
  { name: 'OLIVE SOCK', color: '#65784F', sound: '/ɑ/', keywords: ['hot', 'not', 'top'] },
  { name: 'BLUE MOON', color: '#1E40AF', sound: '/u/', keywords: ['too', 'moon', 'blue'] },
  { name: 'ROSE PHONE', color: '#F472B6', sound: '/oʊ/', keywords: ['go', 'home', 'phone'] },
  { name: 'ORANGE BALL', color: '#EA580C', sound: '/ɔ/', keywords: ['all', 'call', 'small'] },
  { name: 'GRAY DAY', color: '#6B7280', sound: '/eɪ/', keywords: ['day', 'say', 'cake'] },
  { name: 'WOODEN HOOK', color: '#B45309', sound: '/ʊ/', keywords: ['book', 'good', 'look'] },
  { name: 'MUSTARD CUP', color: '#CA8A04', sound: '/ʌ/', keywords: ['up', 'run', 'come'] }
];

export const wordDatabase = [
  // GREEN TEA /i/
  { word: 'tree', stressedVowel: 'ee', colorCategory: 'GREEN TEA', pronunciation: 'tree' },
  { word: 'sea', stressedVowel: 'ea', colorCategory: 'GREEN TEA', pronunciation: 'see' },
  { word: 'believe', stressedVowel: 'ie', colorCategory: 'GREEN TEA', pronunciation: 'be-LIEVE' },
  { word: 'complete', stressedVowel: 'e', colorCategory: 'GREEN TEA', pronunciation: 'com-PLETE' },
  
  // RED PEPPER /ɛ/
  { word: 'head', stressedVowel: 'ea', colorCategory: 'RED PEPPER', pronunciation: 'head' },
  { word: 'friend', stressedVowel: 'ie', colorCategory: 'RED PEPPER', pronunciation: 'friend' },
  { word: 'heavy', stressedVowel: 'ea', colorCategory: 'RED PEPPER', pronunciation: 'HEA-vy' },
  { word: 'ready', stressedVowel: 'ea', colorCategory: 'RED PEPPER', pronunciation: 'REA-dy' },
  
  // SILVER PIN /ɪ/
  { word: 'quick', stressedVowel: 'i', colorCategory: 'SILVER PIN', pronunciation: 'quick' },
  { word: 'sister', stressedVowel: 'i', colorCategory: 'SILVER PIN', pronunciation: 'SIS-ter' },
  { word: 'middle', stressedVowel: 'i', colorCategory: 'SILVER PIN', pronunciation: 'MID-dle' },
  { word: 'begin', stressedVowel: 'i', colorCategory: 'SILVER PIN', pronunciation: 'be-GIN' },
  
  // PURPLE SHIRT /ɜr/
  { word: 'first', stressedVowel: 'ir', colorCategory: 'PURPLE SHIRT', pronunciation: 'first' },
  { word: 'learn', stressedVowel: 'ear', colorCategory: 'PURPLE SHIRT', pronunciation: 'learn' },
  { word: 'early', stressedVowel: 'ear', colorCategory: 'PURPLE SHIRT', pronunciation: 'EAR-ly' },
  { word: 'world', stressedVowel: 'or', colorCategory: 'PURPLE SHIRT', pronunciation: 'world' },
  
  // BROWN COW /aʊ/
  { word: 'house', stressedVowel: 'ou', colorCategory: 'BROWN COW', pronunciation: 'house' },
  { word: 'found', stressedVowel: 'ou', colorCategory: 'BROWN COW', pronunciation: 'found' },
  { word: 'about', stressedVowel: 'ou', colorCategory: 'BROWN COW', pronunciation: 'a-BOUT' },
  { word: 'mountain', stressedVowel: 'ou', colorCategory: 'BROWN COW', pronunciation: 'MOUN-tain' },
  
  // WHITE TIE /aɪ/
  { word: 'time', stressedVowel: 'i', colorCategory: 'WHITE TIE', pronunciation: 'time' },
  { word: 'bright', stressedVowel: 'i', colorCategory: 'WHITE TIE', pronunciation: 'bright' },
  { word: 'arrive', stressedVowel: 'i', colorCategory: 'WHITE TIE', pronunciation: 'ar-RIVE' },
  { word: 'night', stressedVowel: 'i', colorCategory: 'WHITE TIE', pronunciation: 'night' },
  
  // BLACK CAT /æ/
  { word: 'happy', stressedVowel: 'a', colorCategory: 'BLACK CAT', pronunciation: 'HAP-py' },
  { word: 'family', stressedVowel: 'a', colorCategory: 'BLACK CAT', pronunciation: 'FAM-i-ly' },
  { word: 'matter', stressedVowel: 'a', colorCategory: 'BLACK CAT', pronunciation: 'MAT-ter' },
  { word: 'travel', stressedVowel: 'a', colorCategory: 'BLACK CAT', pronunciation: 'TRAV-el' },
  
  // OLIVE SOCK /ɑ/
  { word: 'stop', stressedVowel: 'o', colorCategory: 'OLIVE SOCK', pronunciation: 'stop' },
  { word: 'problem', stressedVowel: 'o', colorCategory: 'OLIVE SOCK', pronunciation: 'PROB-lem' },
  { word: 'doctor', stressedVowel: 'o', colorCategory: 'OLIVE SOCK', pronunciation: 'DOC-tor' },
  { word: 'common', stressedVowel: 'o', colorCategory: 'OLIVE SOCK', pronunciation: 'COM-mon' },
  
  // BLUE MOON /u/
  { word: 'food', stressedVowel: 'oo', colorCategory: 'BLUE MOON', pronunciation: 'food' },
  { word: 'true', stressedVowel: 'ue', colorCategory: 'BLUE MOON', pronunciation: 'true' },
  { word: 'through', stressedVowel: 'ou', colorCategory: 'BLUE MOON', pronunciation: 'through' },
  { word: 'group', stressedVowel: 'ou', colorCategory: 'BLUE MOON', pronunciation: 'group' },
  
  // ROSE PHONE /oʊ/
  { word: 'hope', stressedVowel: 'o', colorCategory: 'ROSE PHONE', pronunciation: 'hope' },
  { word: 'window', stressedVowel: 'o', colorCategory: 'ROSE PHONE', pronunciation: 'WIN-dow' },
  { word: 'open', stressedVowel: 'o', colorCategory: 'ROSE PHONE', pronunciation: 'O-pen' },
  { word: 'slowly', stressedVowel: 'o', colorCategory: 'ROSE PHONE', pronunciation: 'SLOW-ly' },
  
  // ORANGE BALL /ɔ/
  { word: 'also', stressedVowel: 'al', colorCategory: 'ORANGE BALL', pronunciation: 'AL-so' },
  { word: 'always', stressedVowel: 'al', colorCategory: 'ORANGE BALL', pronunciation: 'AL-ways' },
  { word: 'water', stressedVowel: 'a', colorCategory: 'ORANGE BALL', pronunciation: 'WA-ter' },
  { word: 'taught', stressedVowel: 'au', colorCategory: 'ORANGE BALL', pronunciation: 'taught' },
  
  // GRAY DAY /eɪ/
  { word: 'change', stressedVowel: 'a', colorCategory: 'GRAY DAY', pronunciation: 'change' },
  { word: 'paper', stressedVowel: 'a', colorCategory: 'GRAY DAY', pronunciation: 'PA-per' },
  { word: 'today', stressedVowel: 'ay', colorCategory: 'GRAY DAY', pronunciation: 'to-DAY' },
  { word: 'table', stressedVowel: 'a', colorCategory: 'GRAY DAY', pronunciation: 'TA-ble' },
  
  // WOODEN HOOK /ʊ/
  { word: 'put', stressedVowel: 'u', colorCategory: 'WOODEN HOOK', pronunciation: 'put' },
  { word: 'woman', stressedVowel: 'o', colorCategory: 'WOODEN HOOK', pronunciation: 'WO-man' },
  { word: 'should', stressedVowel: 'ou', colorCategory: 'WOODEN HOOK', pronunciation: 'should' },
  { word: 'full', stressedVowel: 'u', colorCategory: 'WOODEN HOOK', pronunciation: 'full' },
  
  // MUSTARD CUP /ʌ/
  { word: 'just', stressedVowel: 'u', colorCategory: 'MUSTARD CUP', pronunciation: 'just' },
  { word: 'mother', stressedVowel: 'o', colorCategory: 'MUSTARD CUP', pronunciation: 'MOTH-er' },
  { word: 'enough', stressedVowel: 'ou', colorCategory: 'MUSTARD CUP', pronunciation: 'e-NOUGH' },
  { word: 'country', stressedVowel: 'ou', colorCategory: 'MUSTARD CUP', pronunciation: 'COUN-try' }
];

export const getRandomWord = () => {
  const randomIndex = Math.floor(Math.random() * wordDatabase.length);
  return wordDatabase[randomIndex];
};

export const analyzeWord = (inputWord) => {
  const word = inputWord.toLowerCase().trim();
  const found = wordDatabase.find(w => w.word.toLowerCase() === word);
  
  if (found) {
    return found;
  }
  
  // Return null if word not found in database
  return null;
};

export const getColorForCategory = (categoryName) => {
  const category = colorVowelChart.find(c => c.name === categoryName);
  return category ? category.color : '#6B7280';
};