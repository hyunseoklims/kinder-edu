/* ============================================================
   아이꿈터 게임 — app.js
   ============================================================ */

// ── Audio ──────────────────────────────────────────────────
let audioCtx = null;
function getAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
function playTone(freq = 523, dur = 0.3, type = 'sine') {
  try {
    const ctx = getAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.28, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + dur);
  } catch(e) {}
}
function playCorrect() {
  playTone(523.25, 0.15); setTimeout(() => playTone(659.25, 0.15), 100); setTimeout(() => playTone(783.99, 0.3), 200);
}
function playWrong() {
  playTone(220, 0.2, 'sawtooth'); setTimeout(() => playTone(196, 0.2, 'sawtooth'), 150);
}
function playCheer() {
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => setTimeout(() => playTone(f, 0.3), i * 120));
}

// ── TTS ────────────────────────────────────────────────────
function speak(text, pitch = 1.3) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ko-KR'; u.rate = 0.95; u.pitch = pitch;
  window.speechSynthesis.speak(u);
}

// ── Toast ──────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// ── View switching ─────────────────────────────────────────
let globalScore = 0;

function showHub() {
  document.getElementById('view-hub').classList.add('active');
  document.getElementById('view-game').classList.remove('active');
  document.getElementById('result-screen').style.display = 'none';
  document.getElementById('header-score-area').style.display = 'flex';
  document.getElementById('global-score').textContent = globalScore;
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

function showGameView() {
  document.getElementById('view-hub').classList.remove('active');
  document.getElementById('view-game').classList.add('active');
  document.getElementById('result-screen').style.display = 'none';
  document.getElementById('header-score-area').style.display = 'flex';
}

// ══════════════════════════════════════════════════════════
//  GAME ENGINE
// ══════════════════════════════════════════════════════════
let currentGame = null;
let currentRound = 0;
let totalRounds = 10;
let sessionScore = 0;

const GAME_CONFIGS = {
  hangul: { title: '🔤 한글 자모 맞추기', rounds: 10, fn: generateHangulQ },
  number: { title: '🔢 숫자 세기 퀴즈',   rounds: 10, fn: generateNumberQ },
  color:  { title: '🎨 색깔 맞추기',      rounds: 10, fn: generateColorQ  },
  animal: { title: '🐾 동물 이름 맞추기', rounds: 8,  fn: generateAnimalQ },
};

function startGame(gameKey) {
  getAudio();
  currentGame = gameKey;
  currentRound = 0;
  sessionScore = 0;
  const cfg = GAME_CONFIGS[gameKey];
  totalRounds = cfg.rounds;

  document.getElementById('game-title-bar').textContent = cfg.title;
  document.getElementById('total-rounds').textContent = totalRounds;

  showGameView();
  playTone(659, 0.25);
  nextRound();
}

function retryGame() {
  document.getElementById('result-screen').style.display = 'none';
  startGame(currentGame);
}

function nextRound() {
  if (currentRound >= totalRounds) { endGame(); return; }

  currentRound++;
  document.getElementById('current-round').textContent = currentRound;
  document.getElementById('current-score').textContent = sessionScore;
  document.getElementById('progress-bar').style.width = `${((currentRound - 1) / totalRounds) * 100}%`;

  const cfg = GAME_CONFIGS[currentGame];
  const qData = cfg.fn();
  renderQuestion(qData);
}

function renderQuestion(qData) {
  const container = document.getElementById('game-content');
  container.innerHTML = '';
  container.appendChild(qData.el);
}

function handleAnswer(isCorrect, btn, allBtns, correctIdx) {
  allBtns.forEach(b => b.disabled = true);

  if (isCorrect) {
    btn.classList.add('correct');
    playCorrect();
    sessionScore += 10;
    globalScore += 10;
    showToast('🎉 정답! 대단해요!');
    speak('정답이에요! 잘했어요!');
  } else {
    btn.classList.add('wrong');
    allBtns[correctIdx].classList.add('correct');
    playWrong();
    showToast('😅 아쉬워요! 다시 해봐요!');
    speak('아쉬워요, 다음엔 맞출 수 있어요!');
  }

  document.getElementById('current-score').textContent = sessionScore;
  document.getElementById('global-score').textContent = globalScore;

  setTimeout(nextRound, 1400);
}

function endGame() {
  document.getElementById('progress-bar').style.width = '100%';
  playCheer();

  const pct = sessionScore / (totalRounds * 10);
  let emoji, title;
  if (pct >= 0.9)      { emoji = '🏆'; title = '완벽해요! 최고 점수!'; }
  else if (pct >= 0.7) { emoji = '🎉'; title = '잘했어요! 훌륭해요!'; }
  else if (pct >= 0.5) { emoji = '🌟'; title = '좋아요! 조금만 더!'; }
  else                  { emoji = '💪'; title = '도전! 다시 해봐요!'; }

  const stars = pct >= 0.9 ? '⭐⭐⭐' : pct >= 0.6 ? '⭐⭐' : '⭐';

  document.getElementById('result-emoji').textContent = emoji;
  document.getElementById('result-title').textContent = title;
  document.getElementById('result-score').textContent = sessionScore;
  document.getElementById('result-stars').textContent = stars;
  document.getElementById('result-screen').style.display = 'flex';

  speak(`게임 끝! ${sessionScore}점 획득! ${title}`, 1.2);
}

// ══════════════════════════════════════════════════════════
//  GAME 1: 한글 자모 맞추기
// ══════════════════════════════════════════════════════════
const HANGUL_DATA = [
  { letter: 'ㄱ', name: '기역',  choices: ['기역','니은','디귿','리을'] },
  { letter: 'ㄴ', name: '니은',  choices: ['기역','니은','미음','비읍'] },
  { letter: 'ㄷ', name: '디귿',  choices: ['디귿','리을','시옷','지읒'] },
  { letter: 'ㄹ', name: '리을',  choices: ['기역','리을','미음','히읗'] },
  { letter: 'ㅁ', name: '미음',  choices: ['니은','미음','비읍','시옷'] },
  { letter: 'ㅂ', name: '비읍',  choices: ['비읍','이응','지읒','치읓'] },
  { letter: 'ㅅ', name: '시옷',  choices: ['디귿','리을','시옷','히읗'] },
  { letter: 'ㅇ', name: '이응',  choices: ['미음','이응','지읒','키읔'] },
  { letter: 'ㅈ', name: '지읒',  choices: ['지읒','치읓','키읔','티읕'] },
  { letter: 'ㅎ', name: '히읗',  choices: ['기역','리을','시옷','히읗'] },
  { letter: 'ㅏ', name: '아',    choices: ['아','야','어','여'] },
  { letter: 'ㅑ', name: '야',    choices: ['아','야','오','우'] },
  { letter: 'ㅓ', name: '어',    choices: ['아','어','오','이'] },
  { letter: 'ㅗ', name: '오',    choices: ['아','야','오','요'] },
  { letter: 'ㅜ', name: '우',    choices: ['아','우','으','이'] },
  { letter: 'ㅡ', name: '으',    choices: ['어','오','으','이'] },
  { letter: 'ㅣ', name: '이',    choices: ['아','야','이','오'] },
];

function generateHangulQ() {
  const item = HANGUL_DATA[Math.floor(Math.random() * HANGUL_DATA.length)];
  const choices = [...item.choices].sort(() => Math.random() - 0.5);
  const correctIdx = choices.indexOf(item.name);

  const el = document.createElement('div');
  el.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:1.8rem;width:100%;';
  el.innerHTML = `
    <p class="q-sub">이 글자의 이름은 무엇일까요?</p>
    <div class="hangul-letter">${item.letter}</div>
    <div class="choices-grid">
      ${choices.map((c, i) => `<button class="choice-btn" data-idx="${i}">${c}</button>`).join('')}
    </div>
  `;

  speak(`이 글자의 이름은 무엇일까요?`);

  const btns = [...el.querySelectorAll('.choice-btn')];
  btns.forEach((btn, i) => {
    btn.onclick = () => handleAnswer(i === correctIdx, btn, btns, correctIdx);
  });

  return { el };
}

// ══════════════════════════════════════════════════════════
//  GAME 2: 숫자 세기 퀴즈
// ══════════════════════════════════════════════════════════
const COUNT_EMOJIS = ['🍎','🌟','🐶','🎈','🦋','🍓','🌻','🐸','🍕','💎'];

function generateNumberQ() {
  const count = Math.floor(Math.random() * 8) + 2; // 2~9
  const emoji = COUNT_EMOJIS[Math.floor(Math.random() * COUNT_EMOJIS.length)];

  // Wrong choices (unique, no negatives)
  const wrongSet = new Set();
  while (wrongSet.size < 3) {
    const w = count + (Math.random() < 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
    if (w > 0 && w !== count) wrongSet.add(w);
  }
  const choices = [count, ...wrongSet].sort(() => Math.random() - 0.5);
  const correctIdx = choices.indexOf(count);

  const el = document.createElement('div');
  el.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:1.8rem;width:100%;';
  el.innerHTML = `
    <p class="q-sub">이모지가 몇 개인지 세어보세요!</p>
    <div class="emoji-count-grid">
      ${Array(count).fill(`<span class="count-emoji">${emoji}</span>`).join('')}
    </div>
    <div class="choices-grid">
      ${choices.map((c, i) => `<button class="choice-btn" data-idx="${i}">${c}</button>`).join('')}
    </div>
  `;

  speak(`${emoji}가 몇 개인지 세어볼까요?`);

  const btns = [...el.querySelectorAll('.choice-btn')];
  btns.forEach((btn, i) => {
    btn.onclick = () => handleAnswer(i === correctIdx, btn, btns, correctIdx);
  });

  return { el };
}

// ══════════════════════════════════════════════════════════
//  GAME 3: 색깔 맞추기
// ══════════════════════════════════════════════════════════
const COLORS = [
  { name: '빨강', hex: '#EF4444' },
  { name: '파랑', hex: '#3B82F6' },
  { name: '노랑', hex: '#FBBF24' },
  { name: '초록', hex: '#10B981' },
  { name: '보라', hex: '#8B5CF6' },
  { name: '주황', hex: '#F97316' },
  { name: '분홍', hex: '#EC4899' },
  { name: '하늘', hex: '#38BDF8' },
];

function generateColorQ() {
  // Pick 4 random colors, one is the answer
  const shuffled = [...COLORS].sort(() => Math.random() - 0.5).slice(0, 4);
  const correct = shuffled[Math.floor(Math.random() * shuffled.length)];
  // Display word in a DIFFERENT color
  const displayColor = shuffled.find(c => c.name !== correct.name) || shuffled[0];

  const el = document.createElement('div');
  el.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:1.8rem;width:100%;';
  el.innerHTML = `
    <p class="q-sub">글자가 말하는 <strong style="color:#FBBF24">색깔</strong>을 눌러주세요!</p>
    <div class="color-word" style="color:${displayColor.hex}">${correct.name}</div>
    <div class="color-circles-row">
      ${shuffled.map((c, i) =>
        `<button class="color-btn" data-idx="${i}" style="background:${c.hex}" title="${c.name}"></button>`
      ).join('')}
    </div>
  `;

  speak(`글자가 말하는 색깔을 찾아보세요! ${correct.name}은 어디 있을까요?`);

  const correctIdx = shuffled.indexOf(correct);
  const btns = [...el.querySelectorAll('.color-btn')];
  btns.forEach((btn, i) => {
    btn.onclick = () => handleAnswer(i === correctIdx, btn, btns, correctIdx);
  });

  return { el };
}

// ══════════════════════════════════════════════════════════
//  GAME 4: 동물 이름 맞추기
// ══════════════════════════════════════════════════════════
const ANIMALS = [
  { name: '강아지', emoji: '🐶', sound: '멍멍' },
  { name: '고양이', emoji: '🐱', sound: '야옹' },
  { name: '사자',   emoji: '🦁', sound: '어흥' },
  { name: '개구리', emoji: '🐸', sound: '개굴개굴' },
  { name: '오리',   emoji: '🦆', sound: '꽥꽥' },
  { name: '코끼리', emoji: '🐘', sound: '뿌우' },
  { name: '토끼',   emoji: '🐰', sound: '폴짝폴짝' },
  { name: '곰',     emoji: '🐻', sound: '으르렁' },
  { name: '돼지',   emoji: '🐷', sound: '꿀꿀' },
  { name: '닭',     emoji: '🐔', sound: '꼬끼오' },
];

function generateAnimalQ() {
  const shuffled = [...ANIMALS].sort(() => Math.random() - 0.5);
  const correct = shuffled[0];
  const wrongThree = shuffled.slice(1, 4);
  const choices = [correct, ...wrongThree].sort(() => Math.random() - 0.5);
  const correctIdx = choices.indexOf(correct);

  const el = document.createElement('div');
  el.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:1.8rem;width:100%;';
  el.innerHTML = `
    <p class="q-sub">"<strong style="color:#FBBF24">${correct.sound}!</strong>" 하는 동물은?</p>
    <div class="big-emoji">${correct.emoji}</div>
    <div class="choices-grid">
      ${choices.map((c, i) => `<button class="choice-btn" data-idx="${i}">${c.emoji}<br>${c.name}</button>`).join('')}
    </div>
  `;

  speak(`${correct.sound}! ${correct.sound}! 이 동물은 무엇일까요?`);

  const btns = [...el.querySelectorAll('.choice-btn')];
  btns.forEach((btn, i) => {
    btn.onclick = () => handleAnswer(i === correctIdx, btn, btns, correctIdx);
  });

  return { el };
}

// ── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('global-score').textContent = globalScore;
});
