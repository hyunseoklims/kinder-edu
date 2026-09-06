// Audio Context for sweet synthesized sounds
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Play pleasant tone with Web Audio
function playChime(freq = 523.25, duration = 0.4, type = 'sine') {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.log('Audio not allowed yet:', e);
  }
}

// Global View Switching
function switchView(viewName) {
  const views = ['selector', 'teacher', 'kids'];
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) el.classList.remove('active');
  });

  const target = document.getElementById(`view-${viewName}`);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Header Nav buttons update
  const teacherBtn = document.getElementById('nav-teacher-btn');
  const kidsBtn = document.getElementById('nav-kids-btn');
  
  if (teacherBtn && kidsBtn) {
    teacherBtn.classList.remove('active-teacher');
    kidsBtn.classList.remove('active-kids');
    
    if (viewName === 'teacher') teacherBtn.classList.add('active-teacher');
    if (viewName === 'kids') kidsBtn.classList.add('active-kids');
  }

  // Play gentle transition chime
  playChime(659.25, 0.25);
}

// Toast Notification
function showToast(msg) {
  const toast = document.getElementById('toast-notice');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ==========================================
// Teacher Tools: Classroom Timer
// ==========================================
let timerInterval = null;
let timerSeconds = 300; // 5 mins default
let isTimerRunning = false;

function updateTimerDisplay() {
  const mins = Math.floor(timerSeconds / 60);
  const secs = timerSeconds % 60;
  const display = document.getElementById('timer-display');
  if (display) {
    display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
}

function setTimerPreset(seconds) {
  pauseTimer();
  timerSeconds = seconds;
  updateTimerDisplay();
  playChime(440, 0.2);
}

function startTimer() {
  if (isTimerRunning) return;
  isTimerRunning = true;
  getAudioContext();
  
  const startBtn = document.getElementById('timer-start-btn');
  if (startBtn) startBtn.textContent = '⏸️ 일시정지';

  timerInterval = setInterval(() => {
    if (timerSeconds > 0) {
      timerSeconds--;
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval);
      isTimerRunning = false;
      if (startBtn) startBtn.textContent = '▶️ 시작하기';
      
      // Ring celebration chimes
      playChime(523.25, 0.4);
      setTimeout(() => playChime(659.25, 0.4), 200);
      setTimeout(() => playChime(783.99, 0.8), 400);
      showToast('🎉 시간이 다 되었습니다! 정리해 볼까요?');
    }
  }, 1000);
}

function pauseTimer() {
  if (isTimerRunning) {
    clearInterval(timerInterval);
    isTimerRunning = false;
    const startBtn = document.getElementById('timer-start-btn');
    if (startBtn) startBtn.textContent = '▶️ 계속하기';
  } else {
    startTimer();
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
  timerSeconds = 300;
  updateTimerDisplay();
  const startBtn = document.getElementById('timer-start-btn');
  if (startBtn) startBtn.textContent = '▶️ 시작하기';
}

// ==========================================
// Teacher Tools: Random Picker
// ==========================================
const studentNames = [
  '1번 친구', '2번 친구', '3번 친구', '4번 친구', '5번 친구',
  '6번 친구', '7번 친구', '8번 친구', '9번 친구', '10번 친구',
  '11번 친구', '12번 친구', '13번 친구', '14번 친구', '15번 친구'
];

function pickRandomStudent() {
  const display = document.getElementById('picker-display');
  if (!display) return;
  
  getAudioContext();
  display.classList.add('spinning');
  
  let counter = 0;
  const shuffleInterval = setInterval(() => {
    const randomIdx = Math.floor(Math.random() * studentNames.length);
    display.textContent = `🎯 ${studentNames[randomIdx]}`;
    playChime(400 + counter * 20, 0.08);
    counter++;
    
    if (counter >= 15) {
      clearInterval(shuffleInterval);
      display.classList.remove('spinning');
      const finalWinner = studentNames[Math.floor(Math.random() * studentNames.length)];
      display.textContent = `⭐ ${finalWinner} ⭐`;
      
      // Celebration sound
      playChime(587.33, 0.2);
      setTimeout(() => playChime(880, 0.5), 150);
      showToast(`✨ 오늘의 발표 대장은 [${finalWinner}] 당첨!`);
    }
  }, 100);
}

// Materials Filter
function filterMaterials(category) {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');

  const cards = document.querySelectorAll('.material-card');
  cards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
  playChime(523, 0.15);
}

function printSample(title) {
  showToast(`🖨️ [${title}] 인쇄 창을 준비합니다.`);
  setTimeout(() => {
    window.print();
  }, 600);
}

// ==========================================
// Kids Playground: Animal Sounds & TTS
// ==========================================
const animalVoices = {
  dog: { sound: '멍멍! 멍멍! 🐶', speech: '멍멍! 나는 충성스럽고 귀여운 강아지야!', freq: 380 },
  cat: { sound: '야옹~ 야옹~ 🐱', speech: '야옹~ 나는 기분 좋은 고양이란다!', freq: 650 },
  lion: { sound: '어흥~! 🦁', speech: '어흥! 나는 멋진 초원의 왕 사자야!', freq: 190 },
  frog: { sound: '개굴개굴~ 🐸', speech: '개굴개굴! 비 오는 날이 신나는 개구리야!', freq: 440 },
  duck: { sound: '꽥꽥! 꽥꽥! 🦆', speech: '꽥꽥! 물 위를 둥둥 떠다니는 귀여운 오리란다!', freq: 520 },
  elephant: { sound: '뿌우우우~! 🐘', speech: '뿌우우! 코가 기다란 힘센 코끼리야!', freq: 150 }
};

function playAnimal(animalKey) {
  const info = animalVoices[animalKey];
  if (!info) return;

  // Sound effect
  playChime(info.freq, 0.4, 'triangle');
  setTimeout(() => playChime(info.freq * 1.2, 0.4, 'triangle'), 150);
  
  showToast(info.sound);

  // SpeechSynthesis TTS
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(info.speech);
    utter.lang = 'ko-KR';
    utter.rate = 1.0;
    utter.pitch = 1.3; // Cute high pitch for children
    window.speechSynthesis.speak(utter);
  }
}

// ==========================================
// Kids Playground: Rainbow Piano Notes
// ==========================================
const pianoFreqs = {
  c: 261.63, // 도
  d: 293.66, // 레
  e: 329.63, // 미
  f: 349.23, // 파
  g: 392.00, // 솔
  a: 440.00, // 라
  b: 493.88  // 시
};

function playPiano(note) {
  const freq = pianoFreqs[note];
  if (freq) {
    playChime(freq, 0.5, 'sine');
  }
}

// Kids Playground: Star Sticker
function toggleSticker(element) {
  const stars = ['⭐', '🌟', '💖', '🎈', '🌻', '🍭'];
  const randomStar = stars[Math.floor(Math.random() * stars.length)];
  element.textContent = randomStar;
  
  // High cheerful harp tone
  playChime(880 + Math.random() * 400, 0.35, 'sine');
  showToast('칭찬 스티커 쾅! 참 잘했어요! 👍');
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  updateTimerDisplay();
});
