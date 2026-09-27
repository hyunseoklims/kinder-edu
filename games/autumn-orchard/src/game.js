(function () {
  'use strict';

  var bridge = window.KinderGameBridge ? window.KinderGameBridge.createGameClient('autumn-orchard') : null;

  // Web Audio 기반 맑은 마림바 및 방울 사운드
  var audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      var AudioClass = window.AudioContext || window.webkitAudioContext;
      if (AudioClass) audioCtx = new AudioClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  var scaleNotes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25];

  function playHarvestChime(index) {
    if (bridge && bridge.isMuted()) return;
    try {
      var ctx = getAudioContext();
      if (!ctx) return;
      var freq = scaleNotes[index % scaleNotes.length] || 392;

      // 주음 (마림바)
      var osc1 = ctx.createOscillator();
      var gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, ctx.currentTime);

      // 통통 튀는 배음
      var osc2 = ctx.createOscillator();
      var gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2.5, ctx.currentTime);

      gain1.gain.setValueAtTime(0.28, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      gain2.gain.setValueAtTime(0.12, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      osc1.connect(gain1); gain1.connect(ctx.destination);
      osc2.connect(gain2); gain2.connect(ctx.destination);

      osc1.start(); osc2.start();
      osc1.stop(ctx.currentTime + 0.4); osc2.stop(ctx.currentTime + 0.2);
    } catch (_) {}
  }

  function playFanfare() {
    if (bridge && bridge.isMuted()) return;
    try {
      var ctx = getAudioContext();
      if (!ctx) return;
      var notes = [
        { f: 392.00, t: 0 },
        { f: 523.25, t: 0.12 },
        { f: 659.25, t: 0.24 },
        { f: 783.99, t: 0.38 }
      ];
      notes.forEach(function (n) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, ctx.currentTime + n.t);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.t + 0.4);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(ctx.currentTime + n.t);
        osc.stop(ctx.currentTime + n.t + 0.4);
      });
    } catch (_) {}
  }

  var FRUIT_TEMPLATES = {
    apple: `
      <svg class="fruit-art-svg" viewBox="0 0 60 60">
        <defs>
          <radialGradient id="appleGrad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stop-color="#FF7675"/>
            <stop offset="60%" stop-color="#E84118"/>
            <stop offset="100%" stop-color="#C23616"/>
          </radialGradient>
        </defs>
        <!-- 꼭지 -->
        <path d="M30 16 C30 8 36 6 38 4" stroke="#5D4037" stroke-width="3" stroke-linecap="round" fill="none"/>
        <!-- 잎사귀 -->
        <path d="M32 10 Q42 6 44 14 Q36 16 32 10 Z" fill="#66BB6A"/>
        <!-- 사과 몸체 -->
        <path d="M30 18 C20 18 12 25 12 36 C12 48 22 55 30 53 C38 55 48 48 48 36 C48 25 40 18 30 18 Z" fill="url(#appleGrad)"/>
        <!-- 하이라이트 -->
        <ellipse cx="22" cy="27" rx="3.5" ry="7" fill="#FFEAA7" opacity="0.6" transform="rotate(-25 22 27)"/>
      </svg>
    `,
    persimmon: `
      <svg class="fruit-art-svg" viewBox="0 0 60 60">
        <defs>
          <radialGradient id="persimmonGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#FFA726"/>
            <stop offset="65%" stop-color="#FB8C00"/>
            <stop offset="100%" stop-color="#E65100"/>
          </radialGradient>
        </defs>
        <!-- 꼭지 -->
        <path d="M30 15 L30 8" stroke="#4E342E" stroke-width="3" stroke-linecap="round"/>
        <!-- 단감 몸체 (약간 납작하고 통통한 모양) -->
        <ellipse cx="30" cy="36" rx="20" ry="17" fill="url(#persimmonGrad)"/>
        <!-- 초록 꽃받침 꼭지잎 (4장) -->
        <path d="M30 17 L22 13 L26 19 L19 22 L27 23 L26 30 L30 24 L34 30 L33 23 L41 22 L34 19 L38 13 Z" fill="#43A047"/>
        <!-- 하이라이트 -->
        <ellipse cx="23" cy="31" rx="4" ry="3" fill="#FFF3E0" opacity="0.6"/>
      </svg>
    `
  };

  var STAGES = [
    { level: 1, name: '1단계: 달콤한 꿀사과 (4개)', apples: 4, persimmons: 0, stars: '⭐☆☆' },
    { level: 2, name: '2단계: 주홍빛 단감 (5개)', apples: 0, persimmons: 5, stars: '⭐⭐☆' },
    { level: 3, name: '3단계: 풍성한 과수원 (8개)', apples: 4, persimmons: 4, stars: '⭐⭐⭐' }
  ];

  var currentStageIndex = 0;
  var harvestedCount = 0;
  var totalToHarvest = 0;
  var idleHintTimer = null;

  var companionQuotes = [
    '과수원 열매를 톡톡 따줘! 🍎',
    '와! 정말 달콤하게 익었어! ✨',
    '바구니에 쏙 담겼네! 🧺',
    '가을 햇살을 듬뿍 받았어! ☀️',
    '과수원 친구들이 정말 고마워해요! 🦔'
  ];

  // DOM 요소
  var stagePill = document.getElementById('stage-pill');
  var harvestCountEl = document.getElementById('harvest-count');
  var missionTotalEl = document.getElementById('mission-total');
  var guideBubble = document.getElementById('guide-bubble');
  var treeLayer = document.getElementById('fruits-tree-layer');
  var basketFillEl = document.getElementById('basket-fill-fruits');
  var basketBox = document.getElementById('basket-station-box');
  var companionEl = document.getElementById('orchard-companion');
  var speechEl = document.getElementById('companion-speech');
  var celebrationOverlay = document.getElementById('celebration-overlay');
  var clearedTitle = document.getElementById('cleared-title');
  var clearedDesc = document.getElementById('cleared-desc');
  var clearedStars = document.getElementById('cleared-stars');
  var btnNext = document.getElementById('btn-next-stage');
  var btnSound = document.getElementById('btn-sound-toggle');

  function resetIdleHint() {
    clearTimeout(idleHintTimer);
    var fruits = treeLayer.querySelectorAll('.orchard-fruit:not(.falling)');
    fruits.forEach(function (f) { f.classList.remove('hint-shimmer'); });
    if (harvestedCount >= totalToHarvest) return;

    idleHintTimer = setTimeout(function () {
      var remaining = treeLayer.querySelectorAll('.orchard-fruit:not(.falling)');
      if (remaining.length > 0) {
        remaining[0].classList.add('hint-shimmer');
      }
    }, 5000);
  }

  function startStage(stageIdx) {
    currentStageIndex = stageIdx % STAGES.length;
    var st = STAGES[currentStageIndex];
    harvestedCount = 0;
    totalToHarvest = st.apples + st.persimmons;

    stagePill.textContent = st.name;
    harvestCountEl.textContent = '0';
    missionTotalEl.textContent = '/ ' + totalToHarvest;
    guideBubble.textContent = '나무에 주렁주렁 열린 탐스러운 과일을 터치해 수확해보세요! 🍎';
    speechEl.textContent = companionQuotes[0];
    basketFillEl.innerHTML = '';
    celebrationOverlay.hidden = true;
    treeLayer.innerHTML = '';

    createFruitsOnTree(st);
    resetIdleHint();
  }

  function createFruitsOnTree(st) {
    var fruitsList = [];
    for (var i = 0; i < st.apples; i++) fruitsList.push({ type: 'apple', name: '꿀사과' });
    for (var j = 0; j < st.persimmons; j++) fruitsList.push({ type: 'persimmon', name: '단감' });
    fruitsList.sort(function () { return Math.random() - 0.5; });

    // 나뭇가지 풍성한 수관(Tree Canopy) 영역의 자연스러운 열매 지점들
    var branchAnchors = [
      { x: 18, y: 16 }, { x: 26, y: 14 }, { x: 34, y: 18 }, { x: 22, y: 26 },
      { x: 30, y: 28 }, { x: 38, y: 24 }, { x: 46, y: 16 }, { x: 54, y: 20 },
      { x: 62, y: 18 }, { x: 48, y: 28 }, { x: 58, y: 28 }, { x: 68, y: 24 },
      { x: 74, y: 18 }, { x: 78, y: 28 }
    ];
    // 무작위로 섞어서 과일 수만큼 선택
    branchAnchors.sort(function () { return Math.random() - 0.5; });

    fruitsList.forEach(function (fruit, idx) {
      var anchor = branchAnchors[idx % branchAnchors.length];
      var posX = anchor.x + (Math.random() * 4 - 2);
      var posY = anchor.y + (Math.random() * 4 - 2);

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'orchard-fruit';
      btn.style.left = posX + '%';
      btn.style.top = posY + '%';
      btn.setAttribute('aria-label', fruit.name + ' 수확하기');
      btn.innerHTML = FRUIT_TEMPLATES[fruit.type];

      btn.addEventListener('click', function () {
        if (btn.classList.contains('falling')) return;
        harvestFruit(btn, fruit.type, idx);
      });

      treeLayer.appendChild(btn);
    });
  }

  function harvestFruit(fruitBtn, type, idx) {
    harvestedCount++;
    fruitBtn.classList.remove('hint-shimmer');
    fruitBtn.classList.add('falling');

    // 바구니 좌표 계산
    var fruitRect = fruitBtn.getBoundingClientRect();
    var basketRect = basketBox.getBoundingClientRect();

    var deltaX = (basketRect.left + basketRect.width / 2) - (fruitRect.left + fruitRect.width / 2);
    var deltaY = (basketRect.top + basketRect.height / 3) - (fruitRect.top + fruitRect.height / 2);

    fruitBtn.style.setProperty('--target-x', deltaX + 'px');
    fruitBtn.style.setProperty('--target-y', deltaY + 'px');

    // 효과음 & 바구니 탄력
    playHarvestChime(harvestedCount - 1);

    // 동료 점프 & 대사
    companionEl.classList.remove('happy-jump');
    void companionEl.offsetWidth;
    companionEl.classList.add('happy-jump');
    speechEl.textContent = companionQuotes[(harvestedCount - 1) % companionQuotes.length];

    // UI 카운트
    harvestCountEl.textContent = harvestedCount;
    guideBubble.textContent = '수확 성공! (' + harvestedCount + ' / ' + totalToHarvest + ')';

    // 바구니 젤리 탄력 & 미니 과일 칩 추가
    setTimeout(function () {
      basketBox.classList.remove('basket-bounce');
      void basketBox.offsetWidth;
      basketBox.classList.add('basket-bounce');

      var chip = document.createElement('div');
      chip.className = 'mini-harvest-chip';
      chip.innerHTML = FRUIT_TEMPLATES[type];
      basketFillEl.appendChild(chip);
    }, 550);

    resetIdleHint();

    // 완료 체크
    if (harvestedCount >= totalToHarvest) {
      setTimeout(showStageClear, 850);
    }
  }

  function showStageClear() {
    playFanfare();
    var st = STAGES[currentStageIndex];
    celebrationOverlay.hidden = false;
    clearedTitle.textContent = st.name + ' 완성!';
    clearedDesc.textContent = '달콤한 가을 열매 ' + totalToHarvest + '개를 모두 풍성하게 수확했어요!';
    clearedStars.textContent = st.stars;

    if (currentStageIndex >= STAGES.length - 1) {
      btnNext.textContent = '처음부터 다시 하기 🌟';
    } else {
      btnNext.textContent = '다음 단계로! ▶';
    }

    if (bridge) bridge.reportScore(totalToHarvest * 100);
  }

  btnNext.addEventListener('click', function () {
    if (currentStageIndex >= STAGES.length - 1) {
      startStage(0);
    } else {
      startStage(currentStageIndex + 1);
    }
  });

  btnSound.addEventListener('click', function () {
    var muted = (bridge && typeof bridge.toggleSound === 'function') ? bridge.toggleSound() : false;
    btnSound.textContent = muted ? '🔇' : '🔊';
  });

  if (bridge && typeof bridge.onRestart === 'function') {
    bridge.onRestart(function () { startStage(0); });
  }
  if (bridge && typeof bridge.onMuteChange === 'function') {
    bridge.onMuteChange(function (muted) { btnSound.textContent = muted ? '🔇' : '🔊'; });
  }

  startStage(0);
})();
