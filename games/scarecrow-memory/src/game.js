(function () {
  'use strict';

  var bridge = window.KinderGameBridge ? window.KinderGameBridge.createGameClient('scarecrow-memory') : null;

  // Web Audio 오디오
  var audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      var AudioClass = window.AudioContext || window.webkitAudioContext;
      if (AudioClass) audioCtx = new AudioClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function playSound(type) {
    if (bridge && bridge.isMuted()) return;
    try {
      var ctx = getAudioContext();
      if (!ctx) return;
      if (type === 'flip') {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(540, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 0.14);
      } else if (type === 'match') {
        [440, 554.37, 659.25, 880].forEach(function(f, i) {
          var o = ctx.createOscillator();
          var g = ctx.createGain();
          o.type = 'triangle';
          o.frequency.setValueAtTime(f, ctx.currentTime + i * 0.08);
          g.gain.setValueAtTime(0.22, ctx.currentTime + i * 0.08);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.35);
          o.connect(g); g.connect(ctx.destination);
          o.start(ctx.currentTime + i * 0.08);
          o.stop(ctx.currentTime + i * 0.08 + 0.35);
        });
      } else if (type === 'mismatch') {
        // 부드럽고 호기심 어린 물음표 음 (부저음 X)
        var oscM = ctx.createOscillator();
        var gainM = ctx.createGain();
        oscM.type = 'sine';
        oscM.frequency.setValueAtTime(320, ctx.currentTime);
        oscM.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.22);
        gainM.gain.setValueAtTime(0.14, ctx.currentTime);
        gainM.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        oscM.connect(gainM); gainM.connect(ctx.destination);
        oscM.start(); oscM.stop(ctx.currentTime + 0.22);
      } else if (type === 'fanfare') {
        [523.25, 659.25, 783.99, 1046.50].forEach(function(f, i) {
          var oscF = ctx.createOscillator();
          var gainF = ctx.createGain();
          oscF.type = 'triangle';
          oscF.frequency.setValueAtTime(f, ctx.currentTime + i * 0.1);
          gainF.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
          gainF.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.4);
          oscF.connect(gainF); gainF.connect(ctx.destination);
          oscF.start(ctx.currentTime + i * 0.1);
          oscF.stop(ctx.currentTime + i * 0.1 + 0.4);
        });
      }
    } catch(_) {}
  }

  // 따뜻한 수채화 카드 아이템 정의 (Rule 3)
  var CARD_ITEMS = {
    acorn: { label: '도토리 🌰', img: './assets/acorn.png' },
    leaf_ginkgo: { label: '은행잎 💛', img: './assets/leaf_ginkgo.png' },
    leaf_maple: { label: '단풍잎 🍁', img: './assets/leaf_maple.png' },
    leaf_oak: { label: '참나무잎 🤎', img: './assets/leaf_oak.png' },
    squirrel: { label: '다람쥐 🐿️', img: './assets/squirrel.png' },
    hedgehog: { label: '고슴도치 🦔', img: './assets/hedgehog.png' }
  };

  var STAGES = [
    { name: '1단계: 황금 들판 (3쌍)', pairs: ['acorn', 'leaf_ginkgo', 'leaf_maple'], cols: 3, stars: '⭐☆☆' },
    { name: '2단계: 가을 길목 (4쌍)', pairs: ['acorn', 'leaf_ginkgo', 'leaf_maple', 'leaf_oak'], cols: 4, stars: '⭐⭐☆' },
    { name: '3단계: 허수아비 축제 (6쌍)', pairs: ['acorn', 'leaf_ginkgo', 'leaf_maple', 'leaf_oak', 'squirrel', 'hedgehog'], cols: 4, stars: '⭐⭐⭐' }
  ];

  var currentStage = 0;
  var flippedCards = [];
  var matchedPairs = 0;
  var lockBoard = false;
  var idleHintTimer = null;

  var scarecrowQuotes = [
    '같은 그림 짝을 찾아봐! 🌾',
    '와! 똑같은 카드를 찾았어! ✨',
    '눈썰미가 정말 대단해! 🌟',
    '허수아비 옷이 따뜻해져요! 🧥',
    '참 잘했어요! 짝짝짝! 👏'
  ];

  // DOM 요소
  var gridEl = document.getElementById('cards-grid');
  var matchedCountEl = document.getElementById('matched-count');
  var pairsTotalEl = document.getElementById('pairs-total');
  var stagePill = document.getElementById('stage-pill');
  var guideBubble = document.getElementById('guide-bubble');
  var scarecrowBubble = document.getElementById('scarecrow-bubble');
  var scarecrow = document.getElementById('scarecrow-art');
  var overlay = document.getElementById('celebration-overlay');
  var btnNext = document.getElementById('btn-next-stage');
  var btnSound = document.getElementById('btn-sound-toggle');

  // 5초 무조작 스마트 힌트 (Rule 15)
  function resetIdleHint() {
    clearTimeout(idleHintTimer);
    var slots = gridEl.querySelectorAll('.card-slot:not(.matched)');
    slots.forEach(function (s) { s.classList.remove('hint-shimmer'); });
    if (matchedPairs >= STAGES[currentStage].pairs.length) return;

    idleHintTimer = setTimeout(function () {
      var remaining = gridEl.querySelectorAll('.card-slot:not(.matched):not(.flipped)');
      if (remaining.length > 0) {
        remaining[0].classList.add('hint-shimmer');
      }
    }, 5000);
  }

  function startStage(stageIdx) {
    currentStage = stageIdx % STAGES.length;
    var s = STAGES[currentStage];
    matchedPairs = 0;
    flippedCards = [];
    lockBoard = false;

    stagePill.textContent = s.name;
    matchedCountEl.textContent = '0';
    pairsTotalEl.textContent = '/ ' + s.pairs.length;
    guideBubble.textContent = '카드를 2장씩 뒤집어 같은 가을 그림 짝을 찾아보세요! 🌾';
    scarecrowBubble.textContent = scarecrowQuotes[0];
    overlay.hidden = true;

    gridEl.className = 'cards-grid-pane cols-' + s.cols;
    gridEl.innerHTML = '';

    // 카드 덱 생성 (쌍으로 복제)
    var deck = [];
    s.pairs.forEach(function(key) {
      deck.push({ key: key, info: CARD_ITEMS[key] });
      deck.push({ key: key, info: CARD_ITEMS[key] });
    });
    deck.sort(function() { return Math.random() - 0.5; });

    deck.forEach(function(item, idx) {
      var slot = document.createElement('div');
      slot.className = 'card-slot';
      slot.dataset.key = item.key;
      slot.dataset.idx = idx;
      slot.tabIndex = 0;
      slot.setAttribute('role', 'button');
      slot.setAttribute('aria-label', item.info.label + ' 카드');

      slot.innerHTML = `
        <div class="card-flipper">
          <div class="card-side card-back">
            <svg class="card-back-icon" viewBox="0 0 44 44">
              <path d="M22 6 Q30 18 34 38 M22 6 Q14 18 10 38" stroke="#D89A48" stroke-width="2.5" fill="none" opacity="0.6"/>
              <ellipse cx="22" cy="18" rx="5" ry="9" fill="#E8A948"/>
              <ellipse cx="17" cy="24" rx="4" ry="7" fill="#E09F3E" transform="rotate(-20 17 24)"/>
              <ellipse cx="27" cy="24" rx="4" ry="7" fill="#E09F3E" transform="rotate(20 27 24)"/>
              <ellipse cx="22" cy="8" rx="3.5" ry="6" fill="#F4BD68"/>
            </svg>
          </div>
          <div class="card-side card-front">
            <img src="${item.info.img}" class="card-front-img" alt="${item.info.label}" draggable="false">
            <span class="card-front-label">${item.info.label}</span>
          </div>
        </div>
      `;

      slot.addEventListener('click', function() {
        resetIdleHint();
        handleCardFlip(slot);
      });

      slot.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          resetIdleHint();
          handleCardFlip(slot);
        }
      });

      gridEl.appendChild(slot);
    });

    resetIdleHint();
  }

  function handleCardFlip(slot) {
    if (lockBoard) return;
    if (slot.classList.contains('flipped') || slot.classList.contains('matched')) return;

    slot.classList.remove('hint-shimmer');
    slot.classList.add('flipped');
    playSound('flip');
    flippedCards.push(slot);

    if (flippedCards.length === 1) {
      guideBubble.textContent = '다른 카드를 한 장 더 뒤집어보세요! ✨';
    } else if (flippedCards.length === 2) {
      checkMatch();
    }
  }

  function checkMatch() {
    var c1 = flippedCards[0];
    var c2 = flippedCards[1];
    var isMatch = c1.dataset.key === c2.dataset.key;

    if (isMatch) {
      // 짝 맞춤!
      playSound('match');
      c1.classList.add('matched');
      c2.classList.add('matched');
      matchedPairs++;
      matchedCountEl.textContent = matchedPairs;

      // 허수아비 환호 액션
      scarecrow.classList.remove('happy-wave');
      void scarecrow.offsetWidth;
      scarecrow.classList.add('happy-wave');
      scarecrowBubble.textContent = scarecrowQuotes[matchedPairs % scarecrowQuotes.length];

      var itemInfo = CARD_ITEMS[c1.dataset.key];
      guideBubble.textContent = '짝 맞추기 성공! [' + (itemInfo ? itemInfo.label : '') + ']을(를) 찾았어요! 🎉';

      flippedCards = [];

      var s = STAGES[currentStage];
      if (matchedPairs >= s.pairs.length) {
        setTimeout(showStageClear, 750);
      }
    } else {
      // 불일치: 0.85초 후 부드럽게 원위치 (Rule 10: 친절한 재도전)
      lockBoard = true;
      playSound('mismatch');
      guideBubble.textContent = '다시 한 번 잘 기억해볼까요? 🔍';
      scarecrowBubble.textContent = '괜찮아! 다시 해보자! 🌾';

      setTimeout(function() {
        c1.classList.remove('flipped');
        c2.classList.remove('flipped');
        flippedCards = [];
        lockBoard = false;
        guideBubble.textContent = '카드를 2장씩 뒤집어 같은 짝을 찾아보세요!';
      }, 850);
    }
  }

  function showStageClear() {
    playSound('fanfare');
    var s = STAGES[currentStage];
    overlay.hidden = false;
    document.getElementById('cleared-title').textContent = s.name + ' 완성!';
    document.getElementById('cleared-desc').textContent = '황금 들판의 모든 가을 카드 짝을 완벽하게 맞췄어요! 허수아비가 신나서 춤을 춰요!';
    document.getElementById('cleared-stars').textContent = s.stars;

    if (currentStage >= STAGES.length - 1) {
      btnNext.textContent = '처음부터 다시 하기 🌟';
    } else {
      btnNext.textContent = '다음 단계로! ▶';
    }

    if (bridge) bridge.reportScore(s.pairs.length * 100);
  }

  btnNext.addEventListener('click', function() {
    if (currentStage >= STAGES.length - 1) {
      startStage(0);
    } else {
      startStage(currentStage + 1);
    }
  });

  btnSound.addEventListener('click', function() {
    var muted = (bridge && typeof bridge.toggleSound === 'function') ? bridge.toggleSound() : false;
    btnSound.textContent = muted ? '🔇' : '🔊';
  });

  if (bridge && typeof bridge.onRestart === 'function') {
    bridge.onRestart(function() { startStage(0); });
  }
  if (bridge && typeof bridge.onMuteChange === 'function') {
    bridge.onMuteChange(function(muted) { btnSound.textContent = muted ? '🔇' : '🔊'; });
  }

  startStage(0);
})();
