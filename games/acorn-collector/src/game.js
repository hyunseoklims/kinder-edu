(function () {
  'use strict';

  var bridge = window.KinderGameBridge ? window.KinderGameBridge.createGameClient('acorn-collector') : null;

  // Web Audio 기반 맑은 마림바 사운드 합성기
  var audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      var AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) audioCtx = new AudioCtxClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // C major 다이아토닉 음계 (도, 레, 미, 파, 솔, 라, 시, 높은 도, 레, 미)
  var scaleNotes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25];

  function playAcornChime(index) {
    if (bridge && bridge.isMuted()) return;
    try {
      var ctx = getAudioContext();
      if (!ctx) return;
      var freq = scaleNotes[index % scaleNotes.length] || 330;

      // 주음 (기본 마림바 톤)
      var osc1 = ctx.createOscillator();
      var gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, ctx.currentTime);

      // 상음 (맑은 벨 배음)
      var osc2 = ctx.createOscillator();
      var gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 3, ctx.currentTime);

      gain1.gain.setValueAtTime(0.3, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      gain2.gain.setValueAtTime(0.12, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.45);
      osc2.stop(ctx.currentTime + 0.25);
    } catch (_) {}
  }

  function playFanfareSound() {
    if (bridge && bridge.isMuted()) return;
    try {
      var ctx = getAudioContext();
      if (!ctx) return;
      var notes = [
        { f: 261.63, t: 0 },
        { f: 329.63, t: 0.12 },
        { f: 392.00, t: 0.24 },
        { f: 523.25, t: 0.38 },
        { f: 659.25, t: 0.52 }
      ];
      notes.forEach(function (n) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, ctx.currentTime + n.t);
        gain.gain.setValueAtTime(0.22, ctx.currentTime + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.t + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + n.t);
        osc.stop(ctx.currentTime + n.t + 0.4);
      });
    } catch (_) {}
  }

  // 단계별 설정
  var STAGES = [
    { level: 1, name: '1단계: 숲속 잔디밭', total: 5, stars: '⭐☆☆' },
    { level: 2, name: '2단계: 낙엽 더미 속', total: 7, stars: '⭐⭐☆' },
    { level: 3, name: '3단계: 가을 숲 탐험', total: 10, stars: '⭐⭐⭐' }
  ];

  var currentStageIndex = 0;
  var collectedCount = 0;

  // DOM 요소
  var stageTitleEl = document.getElementById('stage-title');
  var stageStarsEl = document.getElementById('stage-stars');
  var countEl = document.getElementById('collected-count');
  var totalEl = document.getElementById('total-count');
  var bubbleEl = document.getElementById('status-bubble');
  var groundEl = document.getElementById('ground-area');
  var squirrelChar = document.getElementById('squirrel-char');
  var squirrelSpeech = document.getElementById('squirrel-speech');
  var basketFillEl = document.getElementById('basket-fill-items');
  var celebrationOverlay = document.getElementById('celebration-overlay');
  var celebrationTitle = document.getElementById('celebration-title');
  var celebrationDesc = document.getElementById('celebration-desc');
  var celebrationStars = document.getElementById('celebration-stars');
  var btnNextStage = document.getElementById('btn-next-stage');
  var btnRetryStage = document.getElementById('btn-retry-stage');
  var btnSoundToggle = document.getElementById('btn-sound-toggle');
  var driftingLeavesEl = document.getElementById('drifting-leaves');

  // 낙엽 바람 애니메이션 생성
  function initDriftingLeaves() {
    if (!driftingLeavesEl) return;
    driftingLeavesEl.innerHTML = '';
    var colors = ['#E86A38', '#F3B43C', '#CA5328', '#DC9B3A'];
    for (var i = 0; i < 6; i++) {
      var leaf = document.createElement('div');
      leaf.className = 'drift-leaf';
      leaf.style.left = (Math.random() * 80) + '%';
      leaf.style.top = (Math.random() * 40) + '%';
      leaf.style.animationDelay = (i * 1.5) + 's';
      leaf.style.animationDuration = (7 + Math.random() * 4) + 's';
      var col = colors[i % colors.length];
      leaf.innerHTML = '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M12 2 C18 6 22 14 12 22 C2 14 6 6 12 2 Z" fill="' + col + '"/><path d="M12 2 L12 22" stroke="#FFF" stroke-width="1.2" opacity="0.5"/></svg>';
      driftingLeavesEl.appendChild(leaf);
    }
  }

  // 다람쥐 대사 목록
  var squirrelQuotes = [
    '쏙! 찾았어! 고마워! 🌰',
    '와! 정말 잘 찾는다! ✨',
    '도토리가 또 하나 쏙! 🎶',
    '바구니가 점점 차올라! 🧺',
    '다람쥐 배가 든든해져요! 🐿️'
  ];

  // 스테이지 초기화 및 도토리 배치
  function startStage(stageIdx) {
    currentStageIndex = stageIdx % STAGES.length;
    var stage = STAGES[currentStageIndex];
    collectedCount = 0;

    stageTitleEl.textContent = stage.name;
    stageStarsEl.textContent = stage.stars;
    countEl.textContent = '0';
    totalEl.textContent = '/ ' + stage.total;
    bubbleEl.textContent = '낙엽 사이에 숨은 도토리 ' + stage.total + '개를 찾아보세요!';
    squirrelSpeech.textContent = '도토리를 모아줘! 🌰';
    basketFillEl.innerHTML = '';
    celebrationOverlay.hidden = true;
    groundEl.innerHTML = '';

    // 바닥 장식 낙엽 및 도토리 생성
    createAcornsAndLeaves(stage.total);
  }

  function createAcornsAndLeaves(count) {
    // 겹치지 않게 무작위 분산 좌표 생성
    var positions = [];
    var minX = 6, maxX = 72; // 다람쥐 영역(오른쪽) 침범 방지
    var minY = 10, maxY = 80;

    for (var i = 0; i < count; i++) {
      var x = minX + (i * ((maxX - minX) / count)) + (Math.random() * 5 - 2.5);
      var y = minY + Math.random() * (maxY - minY);
      positions.push({ x: x, y: y });
    }

    // 셔플
    positions.sort(function () { return Math.random() - 0.5; });

    // 낙엽 더미 장식 생성 (도토리를 살짝 가림)
    positions.forEach(function (pos, idx) {
      // 1. 도토리 밑 또는 위의 낙엽 더미
      var leafDecor = document.createElement('div');
      leafDecor.className = 'leaf-pile-item';
      leafDecor.style.left = (pos.x - 3) + '%';
      leafDecor.style.top = (pos.y + 4) + '%';
      var leafColors = ['#D9742B', '#EAA73B', '#C95328', '#8A4B20'];
      var col = leafColors[idx % leafColors.length];
      var rot = (idx * 47) % 360;
      leafDecor.innerHTML = '<svg viewBox="0 0 50 40" width="54" height="44" style="transform:rotate(' + rot + 'deg);"><path d="M5 25 C15 5 35 5 45 25 C35 35 15 35 5 25 Z" fill="' + col + '"/><path d="M5 25 L45 25" stroke="#FFF" stroke-width="1.5" opacity="0.4"/></svg>';
      
      leafDecor.addEventListener('click', function () {
        leafDecor.classList.add('shaking');
        setTimeout(function () { leafDecor.classList.remove('shaking'); }, 400);
      });
      groundEl.appendChild(leafDecor);

      // 2. 인터랙티브 도토리 (따뜻한 동화풍 수채화 투명 PNG)
      var acornBtn = document.createElement('button');
      acornBtn.type = 'button';
      acornBtn.className = 'interactive-acorn';
      acornBtn.style.left = pos.x + '%';
      acornBtn.style.top = pos.y + '%';
      acornBtn.setAttribute('aria-label', '도토리 찾기');

      acornBtn.innerHTML = '<img src="./assets/acorn.png" alt="도토리" class="acorn-wc-img" draggable="false">';

      acornBtn.addEventListener('click', function () {
        if (acornBtn.classList.contains('collected')) return;
        resetIdleHint();
        collectAcorn(acornBtn, idx);
      });

      groundEl.appendChild(acornBtn);
    });

    resetIdleHint();
  }

  // 5초 무조작 시 도토리 살랑살랑 힌트 (Rule 15)
  var idleHintTimer = null;
  function resetIdleHint() {
    clearTimeout(idleHintTimer);
    var allAcorns = groundEl.querySelectorAll('.interactive-acorn:not(.collected)');
    allAcorns.forEach(function (el) { el.classList.remove('hint-shimmer'); });
    if (collectedCount >= STAGES[currentStageIndex].total) return;

    idleHintTimer = setTimeout(function () {
      var remaining = groundEl.querySelectorAll('.interactive-acorn:not(.collected)');
      if (remaining.length > 0) {
        remaining[0].classList.add('hint-shimmer');
      }
    }, 5000);
  }

  function collectAcorn(acornBtn, idx) {
    var stage = STAGES[currentStageIndex];
    collectedCount++;
    acornBtn.classList.remove('hint-shimmer');
    acornBtn.classList.add('collected');

    // 바구니 위치 계산
    var basketEl = document.getElementById('basket-container');
    var acornRect = acornBtn.getBoundingClientRect();
    var basketRect = basketEl.getBoundingClientRect();

    var deltaX = (basketRect.left + basketRect.width / 2) - (acornRect.left + acornRect.width / 2);
    var deltaY = (basketRect.top + basketRect.height / 3) - (acornRect.top + acornRect.height / 2);

    acornBtn.style.setProperty('--target-x', deltaX + 'px');
    acornBtn.style.setProperty('--target-y', deltaY + 'px');

    // 효과음 재생
    playAcornChime(collectedCount - 1);

    // 다람쥐 액션 (점프 + 대사)
    squirrelChar.classList.remove('happy-jump');
    void squirrelChar.offsetWidth;
    squirrelChar.classList.add('happy-jump');
    squirrelSpeech.textContent = squirrelQuotes[(collectedCount - 1) % squirrelQuotes.length];

    // UI 카운트 갱신
    countEl.textContent = collectedCount;
    bubbleEl.textContent = '참 잘했어요! (' + collectedCount + ' / ' + stage.total + ')';

    // 바구니에 수채화 도토리 미니 아이콘 쏙 넣기
    setTimeout(function () {
      var chip = document.createElement('img');
      chip.src = './assets/acorn.png';
      chip.className = 'basket-acorn-mini';
      chip.alt = '도토리';
      basketFillEl.appendChild(chip);
    }, 600);

    // 완료 체크
    if (collectedCount >= stage.total) {
      setTimeout(showStageClear, 850);
    }
  }

  function showStageClear() {
    playFanfareSound();
    var stage = STAGES[currentStageIndex];
    celebrationOverlay.hidden = false;
    celebrationTitle.textContent = stage.name + ' 완성!';
    celebrationDesc.textContent = '도토리 ' + stage.total + '개를 모두 모았어요! 다람쥐가 뛸 듯이 기뻐해요!';
    celebrationStars.textContent = stage.stars;

    // 마지막 단계면 버튼 텍스트 변경
    if (currentStageIndex >= STAGES.length - 1) {
      btnNextStage.textContent = '처음부터 다시 하기 🌟';
    } else {
      btnNextStage.textContent = '다음 단계로! ▶';
    }

    if (bridge) {
      bridge.reportScore(stage.total * 100);
    }
  }

  // 이벤트 리스너 등록
  btnNextStage.addEventListener('click', function () {
    if (currentStageIndex >= STAGES.length - 1) {
      startStage(0);
    } else {
      startStage(currentStageIndex + 1);
    }
  });

  btnRetryStage.addEventListener('click', function () {
    startStage(currentStageIndex);
  });

  btnSoundToggle.addEventListener('click', function () {
    var muted = (bridge && typeof bridge.toggleSound === 'function') ? bridge.toggleSound() : false;
    btnSoundToggle.textContent = muted ? '🔇' : '🔊';
  });

  // 호스트로부터 리스타트/음소거 수신
  if (bridge && typeof bridge.onRestart === 'function') {
    bridge.onRestart(function () {
      startStage(0);
    });
  }
  if (bridge && typeof bridge.onMuteChange === 'function') {
    bridge.onMuteChange(function (muted) {
      btnSoundToggle.textContent = muted ? '🔇' : '🔊';
    });
  }

  // 최초 시작
  initDriftingLeaves();
  startStage(0);
})();
