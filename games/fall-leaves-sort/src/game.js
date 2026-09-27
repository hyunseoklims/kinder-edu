(function () {
  'use strict';

  var bridge = window.KinderGameBridge ? window.KinderGameBridge.createGameClient('fall-leaves-sort') : null;

  // Web Audio 신디사이저 (맑은 실로폰 & 벨 톤)
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
      if (type === 'select') {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'correct') {
        var o1 = ctx.createOscillator();
        var o2 = ctx.createOscillator();
        var g = ctx.createGain();
        o1.type = 'triangle'; o2.type = 'sine';
        o1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        o2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
        g.gain.setValueAtTime(0.24, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        o1.connect(g); o2.connect(g); g.connect(ctx.destination);
        o1.start(); o2.start(ctx.currentTime + 0.08);
        o1.stop(ctx.currentTime + 0.35); o2.stop(ctx.currentTime + 0.35);
      } else if (type === 'gentle-hint') {
        // 부드럽고 호기심을 유발하는 부드러운 하향음 (부저 X)
        var oscW = ctx.createOscillator();
        var gainW = ctx.createGain();
        oscW.type = 'sine';
        oscW.frequency.setValueAtTime(330, ctx.currentTime);
        oscW.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.22);
        gainW.gain.setValueAtTime(0.12, ctx.currentTime);
        gainW.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        oscW.connect(gainW); gainW.connect(ctx.destination);
        oscW.start(); oscW.stop(ctx.currentTime + 0.22);
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

  var ROUNDS = [
    { name: '1단계: 가을 길 산책 (6개)', ginkgo: 2, maple: 2, oak: 2, stars: '⭐☆☆' },
    { name: '2단계: 알록달록 숲속 (9개)', ginkgo: 3, maple: 3, oak: 3, stars: '⭐⭐☆' },
    { name: '3단계: 낙엽 축제 (12개)', ginkgo: 4, maple: 4, oak: 4, stars: '⭐⭐⭐' }
  ];

  var currentRound = 0;
  var selectedLeaf = null;
  var totalLeaves = 0;
  var sortedCount = 0;
  var basketCounts = { ginkgo: 0, maple: 0, oak: 0 };
  var idleHintTimer = null;

  var hedgehogQuotes = [
    '알록달록 예쁜 낙엽을 모아줘! 🦔',
    '와! 알맞은 바구니에 쏙! ✨',
    '정말 잘 분류하고 있어! 🍁',
    '바구니가 예쁘게 채워져요! 🧺',
    '고슴도치 친구가 신이 났어요! 🎶'
  ];

  // DOM 요소
  var trayEl = document.getElementById('leaves-tray');
  var scoreText = document.getElementById('score-text');
  var totalText = document.getElementById('total-text');
  var guideBubble = document.getElementById('guide-bubble');
  var stagePill = document.getElementById('stage-pill');
  var overlay = document.getElementById('celebration-overlay');
  var btnNext = document.getElementById('btn-next-stage');
  var btnSound = document.getElementById('btn-sound-toggle');
  var hedgehogCompanion = document.getElementById('hedgehog-companion');
  var hedgehogSpeech = document.getElementById('hedgehog-speech');

  // 5초 무조작 스마트 힌트 (Rule 15)
  function resetIdleHint() {
    clearTimeout(idleHintTimer);
    var cards = trayEl.querySelectorAll('.leaf-card');
    cards.forEach(function (c) { c.classList.remove('hint-shimmer'); });
    if (sortedCount >= totalLeaves) return;

    idleHintTimer = setTimeout(function () {
      var remaining = trayEl.querySelectorAll('.leaf-card');
      if (remaining.length > 0) {
        remaining[0].classList.add('hint-shimmer');
      }
    }, 5000);
  }

  function initRound(roundIdx) {
    currentRound = roundIdx % ROUNDS.length;
    var r = ROUNDS[currentRound];
    sortedCount = 0;
    selectedLeaf = null;
    basketCounts = { ginkgo: 0, maple: 0, oak: 0 };

    totalLeaves = r.ginkgo + r.maple + r.oak;
    stagePill.textContent = r.name;
    scoreText.textContent = '0';
    totalText.textContent = '/ ' + totalLeaves;
    guideBubble.textContent = '낙엽을 터치한 뒤 어울리는 바구니를 골라보세요! 🍂';
    hedgehogSpeech.textContent = hedgehogQuotes[0];
    overlay.hidden = true;

    document.getElementById('count-ginkgo').textContent = '0개 담음';
    document.getElementById('count-maple').textContent = '0개 담음';
    document.getElementById('count-oak').textContent = '0개 담음';

    // 낙엽 목록 생성
    var leafList = [];
    for (var i = 0; i < r.ginkgo; i++) leafList.push({ id: 'g-' + i, type: 'ginkgo', img: './assets/leaf_ginkgo.png', alt: '노란 은행잎' });
    for (var j = 0; j < r.maple; j++) leafList.push({ id: 'm-' + j, type: 'maple', img: './assets/leaf_maple.png', alt: '붉은 단풍잎' });
    for (var k = 0; k < r.oak; k++) leafList.push({ id: 'o-' + k, type: 'oak', img: './assets/leaf_oak.png', alt: '갈색 참나무잎' });

    leafList.sort(function() { return Math.random() - 0.5; });

    trayEl.innerHTML = '';
    leafList.forEach(function(item) {
      var card = document.createElement('div');
      card.className = 'leaf-card';
      card.dataset.id = item.id;
      card.dataset.type = item.type;
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', item.alt);
      card.innerHTML = '<img src="' + item.img + '" class="leaf-wc-img" alt="' + item.alt + '" draggable="false">';

      // 터치 & 클릭 선택 이벤트
      card.addEventListener('click', function(e) {
        e.stopPropagation();
        resetIdleHint();
        selectLeaf(card);
      });

      // 드래그 앤 드롭 지원 (Rule 8)
      setupLeafDrag(card);

      trayEl.appendChild(card);
    });

    resetIdleHint();
  }

  function selectLeaf(card) {
    playSound('select');
    document.querySelectorAll('.leaf-card').forEach(function(c) { c.classList.remove('selected'); });
    selectedLeaf = card;
    card.classList.add('selected');

    var typeNames = { ginkgo: '노란 은행잎', maple: '붉은 단풍잎', oak: '갈색 참나무잎' };
    var name = typeNames[card.dataset.type] || '낙엽';
    guideBubble.textContent = '[' + name + ']을 골랐어요! 아래 어울리는 바구니를 터치하세요!';
  }

  // 드래그 앤 드롭 구현 (Pointer Events - Rule 8: 60px+ 자석 스냅)
  function setupLeafDrag(card) {
    var startX = 0, startY = 0;
    var currentX = 0, currentY = 0;
    var isDragging = false;

    card.addEventListener('pointerdown', function (e) {
      card.setPointerCapture(e.pointerId);
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      selectLeaf(card);
      card.style.zIndex = '100';
    });

    card.addEventListener('pointermove', function (e) {
      if (!isDragging) return;
      currentX = e.clientX - startX;
      currentY = e.clientY - startY;
      card.style.transform = 'translate(' + currentX + 'px, ' + currentY + 'px) scale(1.15)';

      // 호버 바구니 감지
      var targetBasket = findBasketUnderPoint(e.clientX, e.clientY);
      document.querySelectorAll('.basket-station').forEach(function (b) {
        b.classList.toggle('hover-target', b === targetBasket);
      });
    });

    function finishDrag(e) {
      if (!isDragging) return;
      isDragging = false;
      card.releasePointerCapture(e.pointerId);
      card.style.zIndex = '';
      card.style.transform = '';
      document.querySelectorAll('.basket-station').forEach(function (b) { b.classList.remove('hover-target'); });

      var targetBasket = findBasketUnderPoint(e.clientX, e.clientY);
      if (targetBasket) {
        handleBasketDrop(targetBasket, card);
      }
    }

    card.addEventListener('pointerup', finishDrag);
    card.addEventListener('pointercancel', finishDrag);
  }

  function findBasketUnderPoint(x, y) {
    var baskets = document.querySelectorAll('.basket-station');
    for (var i = 0; i < baskets.length; i++) {
      var rect = baskets[i].getBoundingClientRect();
      // 60px 자석 스냅 패딩 (Rule 8)
      if (x >= rect.left - 30 && x <= rect.right + 30 &&
          y >= rect.top - 30 && y <= rect.bottom + 30) {
        return baskets[i];
      }
    }
    return null;
  }

  function handleBasketDrop(basket, leaf) {
    var leafType = leaf.dataset.type;
    var basketType = basket.dataset.type;

    if (leafType === basketType) {
      // 정답!
      playSound('correct');
      basket.classList.remove('bounce-correct');
      void basket.offsetWidth;
      basket.classList.add('bounce-correct');

      // 고슴도치 점프 & 격려
      if (hedgehogCompanion) {
        hedgehogCompanion.classList.remove('happy-bounce');
        void hedgehogCompanion.offsetWidth;
        hedgehogCompanion.classList.add('happy-bounce');
        hedgehogSpeech.textContent = hedgehogQuotes[(sortedCount + 1) % hedgehogQuotes.length];
      }

      basketCounts[basketType]++;
      document.getElementById('count-' + basketType).textContent = basketCounts[basketType] + '개 담음';

      // 낙엽 쏙 제거
      leaf.remove();
      if (selectedLeaf === leaf) selectedLeaf = null;
      sortedCount++;
      scoreText.textContent = sortedCount;
      resetIdleHint();

      guideBubble.textContent = '쏙! 바구니에 알맞게 들어갔어요! 참 잘했어요! ✨';

      if (sortedCount >= totalLeaves) {
        setTimeout(showRoundClear, 700);
      }
    } else {
      // 오답 - 부드러운 격려 피드백 (Rule 10)
      playSound('gentle-hint');
      basket.classList.remove('wobble-gentle');
      void basket.offsetWidth;
      basket.classList.add('wobble-gentle');

      var basketNames = { ginkgo: '노란 은행잎', maple: '붉은 단풍잎', oak: '갈색 참나무잎' };
      guideBubble.textContent = '어라? 여기는 [' + basketNames[basketType] + '] 바구니예요. 다시 골라볼까요? 🔍';
      hedgehogSpeech.textContent = '색깔과 모양을 잘 살펴봐요! 🦔';
    }
  }

  // 바구니 클릭 이벤트 (탭-투-플레이 방식 지원 - Rule 7)
  document.querySelectorAll('.basket-station').forEach(function(basket) {
    basket.addEventListener('click', function() {
      if (!selectedLeaf) {
        guideBubble.textContent = '먼저 위에서 담을 낙엽을 콕! 터치해주세요!';
        return;
      }
      handleBasketDrop(basket, selectedLeaf);
    });
  });

  function showRoundClear() {
    playSound('fanfare');
    var r = ROUNDS[currentRound];
    overlay.hidden = false;
    document.getElementById('cleared-title').textContent = r.name + ' 완성!';
    document.getElementById('cleared-desc').textContent = '낙엽 ' + totalLeaves + '개를 모두 알맞은 바구니에 쏙 정리했어요!';
    document.getElementById('cleared-stars').textContent = r.stars;

    if (currentRound >= ROUNDS.length - 1) {
      btnNext.textContent = '처음부터 다시 하기 🌟';
    } else {
      btnNext.textContent = '다음 단계로! ▶';
    }

    if (bridge) bridge.reportScore(totalLeaves * 100);
  }

  btnNext.addEventListener('click', function() {
    if (currentRound >= ROUNDS.length - 1) {
      initRound(0);
    } else {
      initRound(currentRound + 1);
    }
  });

  btnSound.addEventListener('click', function() {
    var muted = (bridge && typeof bridge.toggleSound === 'function') ? bridge.toggleSound() : false;
    btnSound.textContent = muted ? '🔇' : '🔊';
  });

  if (bridge && typeof bridge.onRestart === 'function') {
    bridge.onRestart(function() { initRound(0); });
  }
  if (bridge && typeof bridge.onMuteChange === 'function') {
    bridge.onMuteChange(function(muted) { btnSound.textContent = muted ? '🔇' : '🔊'; });
  }

  initRound(0);
})();
