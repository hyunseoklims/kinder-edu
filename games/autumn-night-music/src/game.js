(function () {
  'use strict';

  var bridge = window.KinderGameBridge ? window.KinderGameBridge.createGameClient('autumn-night-music') : null;

  // Web Audio 기반 맑은 마림바 & 실로폰 합성기
  var audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      var AudioClass = window.AudioContext || window.webkitAudioContext;
      if (AudioClass) audioCtx = new AudioClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  var NOTES = {
    c4: { freq: 261.63, name: '도', solfege: 'C', keyClass: 'k-c4' },
    d4: { freq: 293.66, name: '레', solfege: 'D', keyClass: 'k-d4' },
    e4: { freq: 329.63, name: '미', solfege: 'E', keyClass: 'k-e4' },
    f4: { freq: 349.23, name: '파', solfege: 'F', keyClass: 'k-f4' },
    g4: { freq: 392.00, name: '솔', solfege: 'G', keyClass: 'k-g4' },
    a4: { freq: 440.00, name: '라', solfege: 'A', keyClass: 'k-a4' },
    b4: { freq: 493.88, name: '시', solfege: 'B', keyClass: 'k-b4' },
    c5: { freq: 523.25, name: '도', solfege: 'C\'', keyClass: 'k-c5' }
  };

  var NOTE_KEYS = ['c4', 'd4', 'e4', 'f4', 'g4', 'a4', 'b4', 'c5'];

  function playNoteSound(freq) {
    if (bridge && bridge.isMuted()) return;
    try {
      var ctx = getAudioContext();
      if (!ctx) return;

      // 주음 (마림바 바이브)
      var osc1 = ctx.createOscillator();
      var gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, ctx.currentTime);

      // 상음 (맑고 영롱한 실로폰 벨)
      var osc2 = ctx.createOscillator();
      var gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 3, ctx.currentTime);

      gain1.gain.setValueAtTime(0.32, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      gain2.gain.setValueAtTime(0.16, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc1.connect(gain1); gain1.connect(ctx.destination);
      osc2.connect(gain2); gain2.connect(ctx.destination);

      osc1.start(); osc2.start();
      osc1.stop(ctx.currentTime + 0.6); osc2.stop(ctx.currentTime + 0.35);
    } catch (_) {}
  }

  function playFanfare() {
    if (bridge && bridge.isMuted()) return;
    try {
      var ctx = getAudioContext();
      if (!ctx) return;
      var notes = [
        { f: 261.63, t: 0 },
        { f: 329.63, t: 0.12 },
        { f: 392.00, t: 0.24 },
        { f: 523.25, t: 0.38 }
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

  // 동요 멜로디 정의
  var SONGS = [
    {
      title: '비행기 ✈️',
      notes: ['e4', 'd4', 'c4', 'd4', 'e4', 'e4', 'e4'],
      lyrics: ['미', '레', '도', '레', '미', '미', '미']
    },
    {
      title: '산토끼 🐇',
      notes: ['g4', 'g4', 'e4', 'e4', 'g4', 'g4', 'e4'],
      lyrics: ['산', '토', '끼', '토', '끼', '야']
    },
    {
      title: '작은 별 ⭐',
      notes: ['c4', 'c4', 'g4', 'g4', 'a4', 'a4', 'g4'],
      lyrics: ['반', '짝', '반', '짝', '작', '은', '별']
    }
  ];

  var currentMode = 'free'; // 'free' | 'song'
  var currentSongIdx = 0;
  var currentNoteStep = 0;
  var idleHintTimer = null;

  var cricketQuotes = ['귀뚤귀뚤~🎻', '맑은 소리야! 🎶', '아름다워요! ✨', '더 연주해줘! 🌙'];
  var bellCricketQuotes = ['또르르~🔔', '영롱한 밤! 🌟', '풀벌레 친구들 신나요! 🦗'];

  // DOM 요소
  var btnModeFree = document.getElementById('btn-mode-free');
  var btnModeSong = document.getElementById('btn-mode-song');
  var songPill = document.getElementById('song-pill');
  var guideBubble = document.getElementById('guide-bubble');
  var frameEl = document.getElementById('xylophone-frame');
  var bugCricket = document.getElementById('bug-cricket');
  var bugBell = document.getElementById('bug-bell');
  var cricketSpeech = document.getElementById('cricket-speech');
  var bellSpeech = document.getElementById('bell-speech');
  var celebrationOverlay = document.getElementById('celebration-overlay');
  var clearedTitle = document.getElementById('cleared-title');
  var clearedDesc = document.getElementById('cleared-desc');
  var btnNext = document.getElementById('btn-next-stage');
  var btnSound = document.getElementById('btn-sound-toggle');

  // 5초 무조작 힌트 (Rule 15)
  function resetIdleHint() {
    clearTimeout(idleHintTimer);
    if (currentMode === 'song') return; // song mode uses guide highlight

    idleHintTimer = setTimeout(function () {
      var randomKey = NOTE_KEYS[Math.floor(Math.random() * NOTE_KEYS.length)];
      var keyEl = frameEl.querySelector('[data-key="' + randomKey + '"]');
      if (keyEl) {
        keyEl.classList.add('target-guide');
        setTimeout(function () { keyEl.classList.remove('target-guide'); }, 1200);
      }
    }, 5000);
  }

  function initXylophone() {
    frameEl.innerHTML = '';
    NOTE_KEYS.forEach(function (k) {
      var n = NOTES[k];
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'leaf-key ' + n.keyClass;
      btn.dataset.key = k;
      btn.setAttribute('aria-label', n.name + ' 음 연주');

      btn.innerHTML = `
        <span class="key-solfege">${n.solfege}</span>
        <span class="key-note-name">${n.name}</span>
      `;

      btn.addEventListener('pointerdown', function () {
        triggerKey(btn, k);
      });

      frameEl.appendChild(btn);
    });
  }

  function triggerKey(btn, noteKey) {
    btn.classList.remove('target-guide');
    btn.classList.add('hit');
    setTimeout(function () { btn.classList.remove('hit'); }, 150);

    var note = NOTES[noteKey];
    playNoteSound(note.freq);

    // 풀벌레 반응
    if (Math.random() > 0.5) {
      bugCricket.classList.remove('playing');
      void bugCricket.offsetWidth;
      bugCricket.classList.add('playing');
      cricketSpeech.textContent = cricketQuotes[Math.floor(Math.random() * cricketQuotes.length)];
    } else {
      bugBell.classList.remove('playing');
      void bugBell.offsetWidth;
      bugBell.classList.add('playing');
      bellSpeech.textContent = bellCricketQuotes[Math.floor(Math.random() * bellCricketQuotes.length)];
    }

    if (currentMode === 'song') {
      handleSongStep(noteKey);
    } else {
      guideBubble.textContent = '영롱한 [' + note.name + '] 소리가 가을밤에 울려 퍼져요! 🎶';
      resetIdleHint();
    }
  }

  function handleSongStep(playedKey) {
    var song = SONGS[currentSongIdx];
    var targetKey = song.notes[currentNoteStep];

    if (playedKey === targetKey) {
      currentNoteStep++;
      if (currentNoteStep >= song.notes.length) {
        // 완곡 성공!
        guideBubble.textContent = '와! [' + song.title + ']을(를) 멋지게 완성했어요! 🎉';
        setTimeout(showSongClear, 600);
      } else {
        updateSongGuide();
      }
    } else {
      // 다른 건반: 부드럽게 올바른 건반 안내
      guideBubble.textContent = '반짝이는 [' + NOTES[targetKey].name + '] 건반을 눌러보세요! ✨';
    }
  }

  function updateSongGuide() {
    var song = SONGS[currentSongIdx];
    var targetKey = song.notes[currentNoteStep];

    frameEl.querySelectorAll('.leaf-key').forEach(function (k) {
      k.classList.remove('target-guide');
    });

    var targetEl = frameEl.querySelector('[data-key="' + targetKey + '"]');
    if (targetEl) targetEl.classList.add('target-guide');

    guideBubble.textContent = '[' + song.lyrics[currentNoteStep] + '] 가사에 맞춰 [' + NOTES[targetKey].name + ']을 눌러보세요! 🌟';
  }

  function showSongClear() {
    playFanfare();
    var song = SONGS[currentSongIdx];
    celebrationOverlay.hidden = false;
    clearedTitle.textContent = song.title + ' 완곡 대성공!';
    clearedDesc.textContent = '풀벌레 친구들과 함께 가을밤 아름다운 하모니를 만들었어요!';

    if (currentSongIdx >= SONGS.length - 1) {
      btnNext.textContent = '처음부터 다시 연주하기 🌟';
    } else {
      btnNext.textContent = '다음 동요 연주하기 ▶';
    }

    if (bridge) bridge.reportScore((currentSongIdx + 1) * 100);
  }

  // 모드 변경
  btnModeFree.addEventListener('click', function () {
    currentMode = 'free';
    btnModeFree.classList.add('is-active');
    btnModeSong.classList.remove('is-active');
    songPill.style.display = 'none';
    guideBubble.textContent = '나뭇잎 실로폰을 톡톡 연주해보세요! 풀벌레 친구들이 노래해요 🦗';
    frameEl.querySelectorAll('.leaf-key').forEach(function (k) { k.classList.remove('target-guide'); });
    resetIdleHint();
  });

  btnModeSong.addEventListener('click', function () {
    currentMode = 'song';
    btnModeSong.classList.add('is-active');
    btnModeFree.classList.remove('is-active');
    songPill.style.display = '';
    currentSongIdx = 0;
    currentNoteStep = 0;
    startSong(0);
  });

  function startSong(idx) {
    currentSongIdx = idx % SONGS.length;
    currentNoteStep = 0;
    var song = SONGS[currentSongIdx];
    songPill.textContent = '곡: ' + song.title;
    celebrationOverlay.hidden = true;
    updateSongGuide();
  }

  btnNext.addEventListener('click', function () {
    if (currentSongIdx >= SONGS.length - 1) {
      startSong(0);
    } else {
      startSong(currentSongIdx + 1);
    }
  });

  btnSound.addEventListener('click', function () {
    var muted = (bridge && typeof bridge.toggleSound === 'function') ? bridge.toggleSound() : false;
    btnSound.textContent = muted ? '🔇' : '🔊';
  });

  if (bridge && typeof bridge.onRestart === 'function') {
    bridge.onRestart(function () {
      if (currentMode === 'song') startSong(0);
      else resetIdleHint();
    });
  }
  if (bridge && typeof bridge.onMuteChange === 'function') {
    bridge.onMuteChange(function (muted) { btnSound.textContent = muted ? '🔇' : '🔊'; });
  }

  initXylophone();
  resetIdleHint();
})();
