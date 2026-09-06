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

// Speak Korean TTS helper
function speakText(text, pitch = 1.3) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ko-KR';
    utter.rate = 1.0;
    utter.pitch = pitch;
    window.speechSynthesis.speak(utter);
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
      speakText('시간이 다 되었습니다! 우리 모두 스스로 정리해 보아요.');
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
      
      playChime(587.33, 0.2);
      setTimeout(() => playChime(880, 0.5), 150);
      showToast(`✨ 오늘의 발표 대장은 [${finalWinner}] 당첨!`);
      speakText(`오늘의 발표 대장은 ${finalWinner} 입니다!`);
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

  playChime(info.freq, 0.4, 'triangle');
  setTimeout(() => playChime(info.freq * 1.2, 0.4, 'triangle'), 150);
  
  showToast(info.sound);
  speakText(info.speech);
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
  
  playChime(880 + Math.random() * 400, 0.35, 'sine');
  showToast('칭찬 스티커 쾅! 참 잘했어요! 👍');
}

// ==========================================================================
// KIDS BURGER KIOSK SIMULATOR (만 5세 햄버거 키오스크 체험)
// ==========================================================================
const kioskData = {
  diningType: '', // '매장' or '포장'
  cart: [],
  orderNumber: 77,
  isCardInserted: false
};

const kioskMenuItems = {
  burger: [
    { id: 'b1', name: '불고기 버거', tag: '달콤 짭짤 최고 인기', emoji: '🍔' },
    { id: 'b2', name: '치즈 버거', tag: '고소한 치즈가 듬뿍', emoji: '🧀🍔' },
    { id: 'b3', name: '바삭 치킨 버거', tag: '바삭바삭 맛있는', emoji: '🍗🍔' }
  ],
  side: [
    { id: 's1', name: '감자 튀김', tag: '바삭바삭 갓 튀긴', emoji: '🍟' },
    { id: 's2', name: '치즈 스틱', tag: '치즈가 쭈욱~', emoji: '🧀' },
    { id: 's3', name: '치킨 너겟', tag: '바삭 고소 4조각', emoji: '🍗' }
  ],
  drink: [
    { id: 'd1', name: '오렌지 주스', tag: '상큼 달콤 비타민', emoji: '🍊' },
    { id: 'd2', name: '딸기 우유', tag: '달콤하고 부드러운', emoji: '🍓' },
    { id: 'd3', name: '시원한 물', tag: '깨끗하고 시원한', emoji: '💧' }
  ]
};

function openKiosk() {
  const overlay = document.getElementById('kiosk-modal');
  if (!overlay) return;
  
  getAudioContext();
  resetKiosk();
  overlay.classList.add('active');
  playChime(587, 0.3);
  speakText('어서오세요! 냠냠 버거랜드입니다. 어디서 드실 건가요?');
}

function closeKiosk() {
  const overlay = document.getElementById('kiosk-modal');
  if (overlay) overlay.classList.remove('active');
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

function resetKiosk() {
  kioskData.diningType = '';
  kioskData.cart = [];
  kioskData.orderNumber = Math.floor(Math.random() * 40) + 60; // 60~99
  kioskData.isCardInserted = false;

  showKioskStep(1);
  renderKioskMenu('burger');
  updateCartDisplay();
  
  const card = document.getElementById('credit-card-item');
  if (card) card.classList.remove('inserting');
}

function showKioskStep(stepNum) {
  for (let i = 1; i <= 4; i++) {
    const el = document.getElementById(`kiosk-step-${i}`);
    if (el) el.classList.remove('active');
  }
  const current = document.getElementById(`kiosk-step-${stepNum}`);
  if (current) current.classList.add('active');

  const stepPill = document.getElementById('kiosk-step-pill');
  if (stepPill) {
    const titles = ['', '1단계: 장소 선택', '2단계: 맛있는 메뉴 고르기', '3단계: 카드 결제하기', '4단계: 주문 완료!'];
    stepPill.textContent = titles[stepNum] || '주문하기';
  }
}

// Step 1: Select Dining Type
function selectDining(type) {
  kioskData.diningType = type;
  playChime(659.25, 0.3);
  
  const msg = type === '매장' ? '매장에서 먹고 가기를 선택했어요! 맛있는 메뉴를 골라볼까요?' : '포장해서 가져가기를 선택했어요! 맛있는 메뉴를 골라볼까요?';
  speakText(msg);
  
  setTimeout(() => {
    showKioskStep(2);
  }, 600);
}

// Step 2: Menu Rendering & Cart
function filterKioskCategory(cat) {
  const buttons = document.querySelectorAll('.kiosk-tab-btn');
  buttons.forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');

  renderKioskMenu(cat);
  playChime(523, 0.15);
}

function renderKioskMenu(category) {
  const container = document.getElementById('kiosk-food-grid');
  if (!container) return;
  container.innerHTML = '';

  const items = kioskMenuItems[category] || [];
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'kiosk-food-card';
    card.onclick = () => addToCart(item);
    card.innerHTML = `
      <div class="kiosk-food-emoji">${item.emoji}</div>
      <h3 class="kiosk-food-title">${item.name}</h3>
      <span class="kiosk-food-tag">${item.tag}</span>
      <button class="kiosk-add-btn">담기 ➕</button>
    `;
    container.appendChild(card);
  });
}

function addToCart(item) {
  kioskData.cart.push(item);
  playChime(784, 0.2);
  speakText(`${item.name}를 담았어요!`);
  updateCartDisplay();
}

function removeFromCart(index) {
  kioskData.cart.splice(index, 1);
  playChime(440, 0.15);
  updateCartDisplay();
}

function updateCartDisplay() {
  const tray = document.getElementById('cart-items-preview');
  const countSpan = document.getElementById('cart-total-count');
  const payBtn = document.getElementById('kiosk-pay-next-btn');
  
  if (!tray) return;
  tray.innerHTML = '';

  if (kioskData.cart.length === 0) {
    tray.innerHTML = '<span style="color: #9CA3AF; font-size: 1.05rem;">메뉴를 골라 담아보세요!</span>';
    if (countSpan) countSpan.textContent = '0';
    if (payBtn) payBtn.disabled = true;
    return;
  }

  if (countSpan) countSpan.textContent = kioskData.cart.length;
  if (payBtn) payBtn.disabled = false;

  kioskData.cart.forEach((item, idx) => {
    const chip = document.createElement('div');
    chip.className = 'cart-item-chip';
    chip.innerHTML = `
      <span>${item.emoji}</span>
      <span>${item.name}</span>
      <button class="cart-item-remove" onclick="event.stopPropagation(); removeFromCart(${idx})">✖</button>
    `;
    tray.appendChild(chip);
  });
}

// Step 3: Go to Payment
function goToPayment() {
  if (kioskData.cart.length === 0) {
    showToast('메뉴를 먼저 골라주세요!');
    return;
  }
  showKioskStep(3);
  playChime(659, 0.3);
  speakText('카드를 리더기에 쏙 넣어주세요!');
}

// Step 3 -> 4: Insert Card Interaction
function handleCardInsert() {
  if (kioskData.isCardInserted) return;
  kioskData.isCardInserted = true;

  const card = document.getElementById('credit-card-item');
  if (card) card.classList.add('inserting');

  // Realistic terminal chime '삑-!'
  playChime(1046.5, 0.4, 'sine');
  showToast('💳 삑-! 결제가 완료되었습니다!');
  speakText('결제가 완료되었습니다! 카드를 챙겨주세요.');

  setTimeout(() => {
    startServingFinale();
  }, 1600);
}

// Step 4: The Grand Finale - Serving Animation!
function startServingFinale() {
  showKioskStep(4);
  
  const orderNumberEl = document.getElementById('serving-order-number');
  if (orderNumberEl) orderNumberEl.textContent = `주문 번호 : ${kioskData.orderNumber}번`;

  // Render ordered items on the waiter's tray
  const tray = document.getElementById('serving-tray-items');
  if (tray) {
    tray.innerHTML = '';
    const sampleItems = kioskData.cart.slice(0, 3); // show up to 3 items on tray
    sampleItems.forEach(item => {
      const span = document.createElement('span');
      span.className = 'tray-food-item';
      span.textContent = item.emoji;
      tray.appendChild(span);
    });
  }

  // Chimes
  playChime(523.25, 0.3);
  setTimeout(() => playChime(659.25, 0.3), 150);
  setTimeout(() => playChime(783.99, 0.3), 300);
  setTimeout(() => playChime(1046.5, 0.6), 450);

  // Crew welcoming Korean voice
  setTimeout(() => {
    speakText(`주문하신 ${kioskData.orderNumber}번 손님, 맛있는 햄버거 나왔습니다! 맛있게 드세요!`, 1.15);
  }, 500);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  updateTimerDisplay();
});
