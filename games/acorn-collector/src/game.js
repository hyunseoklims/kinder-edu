(function () {
  'use strict';

  var bridge = window.KinderGameBridge ? window.KinderGameBridge.createGameClient('acorn-collector') : null;
  
  // Web Audio 기반 경량 신디사이저 (외부 오디오 파일 없이 즉시 재생)
  var audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // 실로폰 톤 재생 (도토리 주울 때: 도-레-미-파-솔)
  var noteFreqs = [261.63, 293.66, 329.63, 349.23, 392.00, 523.25];
  function playNote(step) {
    if (bridge && bridge.isMuted()) return;
    try {
      var ctx = getAudioContext();
      if (!ctx) return;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'triangle';
      var freq = noteFreqs[step % noteFreqs.length] || 330;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (_) {}
  }

  // 승리 축하 팡파레
  function playFanfare() {
    if (bridge && bridge.isMuted()) return;
    try {
      var ctx = getAudioContext();
      if (!ctx) return;
      var notes = [261.63, 329.63, 392.00, 523.25];
      notes.forEach(function (freq, i) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.4);
      });
    } catch (_) {}
  }

  // 게임 상태 변수
  var TOTAL_ACORNS = 5;
  var collected = 0;
  var isMuted = false;

  var countEl = document.getElementById('collected-count');
  var bubbleEl = document.getElementById('status-bubble');
  var containerEl = document.getElementById('acorns-container');
  var basketItemsEl = document.getElementById('basket-items');
  var squirrelEl = document.getElementById('squirrel');
  var basketEl = document.getElementById('basket');
  var overlayEl = document.getElementById('success-overlay');
  var restartBtn = document.getElementById('btn-restart');
  var soundBtn = document.getElementById('btn-sound-toggle');

  // 도토리 배치 좌표 목록 (다양한 위치에 분산)
  var spawnPositions = [
    { left: '22%', top: '48%' },
    { left: '38%', top: '35%' },
    { left: '52%', top: '55%' },
    { left: '68%', top: '38%' },
    { left: '42%', top: '72%' }
  ];

  function initGame() {
    collected = 0;
    countEl.textContent = '0';
    bubbleEl.textContent = '낙엽 속에 숨은 도토리를 찾아 터치해보세요!';
    basketItemsEl.innerHTML = '';
    overlayEl.hidden = true;
    squirrelEl.classList.remove('happy');
    containerEl.innerHTML = '';

    // 도토리 생성
    spawnPositions.forEach(function (pos, index) {
      var acorn = document.createElement('button');
      acorn.type = 'button';
      acorn.className = 'acorn-item';
      acorn.style.left = pos.left;
      acorn.style.top = pos.top;
      acorn.setAttribute('aria-label', '도토리 ' + (index + 1));
      acorn.textContent = '🌰';
      
      // 약간의 지연 애니메이션
      acorn.style.animationDelay = (index * 0.2) + 's';

      acorn.addEventListener('click', function (e) {
        collectAcorn(acorn);
      });

      containerEl.appendChild(acorn);
    });

    if (bridge) bridge.start();
  }

  function collectAcorn(acornEl) {
    if (acornEl.classList.contains('collecting')) return;
    acornEl.classList.add('collecting');

    playNote(collected);
    collected++;
    countEl.textContent = collected;

    // 말풍선 피드백
    var messages = [
      '하나! 잘 찾았어요!',
      '둘! 바구니가 차오르고 있어요.',
      '셋! 절반 넘게 모았어요!',
      '넷! 하나만 더 찾으면 돼요!',
      '다섯! 모두 모았어요! 최고예요!'
    ];
    bubbleEl.textContent = messages[collected - 1] || '도토리를 찾았어요!';

    // 바구니 좌표로 애니메이션 이동
    var basketRect = basketEl.getBoundingClientRect();
    var acornRect = acornEl.getBoundingClientRect();
    var deltaX = (basketRect.left + basketRect.width / 2) - (acornRect.left + acornRect.width / 2);
    var deltaY = (basketRect.top + basketRect.height / 2) - (acornRect.top + acornRect.height / 2);

    acornEl.style.transform = 'translate(' + deltaX + 'px, ' + deltaY + 'px) scale(0.2)';
    acornEl.style.opacity = '0';

    setTimeout(function () {
      if (acornEl.parentNode) acornEl.parentNode.removeChild(acornEl);
      var item = document.createElement('span');
      item.className = 'basket-item-acorn';
      item.textContent = '🌰';
      basketItemsEl.appendChild(item);

      if (collected >= TOTAL_ACORNS) {
        finishGame();
      }
    }, 450);
  }

  function finishGame() {
    playFanfare();
    squirrelEl.classList.add('happy');
    bubbleEl.textContent = '와! 다람쥐가 정말 기뻐해요!';
    setTimeout(function () {
      overlayEl.hidden = false;
      if (bridge) bridge.complete({ acorns: collected });
    }, 800);
  }

  restartBtn.addEventListener('click', function () {
    initGame();
  });

  soundBtn.addEventListener('click', function () {
    isMuted = !isMuted;
    soundBtn.textContent = isMuted ? '🔇' : '🔊';
  });

  // 호스트 postMessage 명령 수신 처리
  if (bridge) {
    bridge.on('HOST_RESTART', function () {
      initGame();
    });
    bridge.on('HOST_SET_MUTED', function (payload) {
      isMuted = !!payload.muted;
      soundBtn.textContent = isMuted ? '🔇' : '🔊';
    });
    bridge.ready();
  }

  // 시작
  initGame();
})();
