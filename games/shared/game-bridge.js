/**
 * Kinder Edu — Game Bridge Client & Host
 * 게임과 부모 호스트 창 간의 안전한 양방향 통신 브릿지
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.KinderGameBridge = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var SOURCE_TAG = 'kinder-edu-game';

  // 개별 게임 클라이언트용 API
  function createGameClient(gameId) {
    var isMuted = false;
    var handlers = {};

    function on(eventType, callback) {
      if (!handlers[eventType]) handlers[eventType] = [];
      handlers[eventType].push(callback);
    }

    function emit(eventType, payload) {
      var message = {
        source: SOURCE_TAG,
        type: eventType,
        gameId: gameId,
        payload: payload || {}
      };
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(message, '*');
      }
    }

    window.addEventListener('message', function (event) {
      var data = event.data;
      if (!data || data.source !== 'kinder-edu-host') return;
      if (data.gameId && data.gameId !== gameId) return;

      if (data.type === 'HOST_SET_MUTED') {
        isMuted = !!data.payload.muted;
      }

      var cbs = handlers[data.type] || [];
      for (var i = 0; i < cbs.length; i++) {
        try {
          cbs[i](data.payload);
        } catch (err) {
          console.error('[GameBridge] Error handling ' + data.type, err);
        }
      }
    });

    return {
      gameId: gameId,
      on: on,
      emit: emit,
      ready: function () { emit('GAME_READY'); },
      start: function () { emit('GAME_START'); },
      complete: function (stats) { emit('GAME_COMPLETE', stats); },
      requestFullscreen: function () { emit('REQUEST_FULLSCREEN'); },
      exit: function () { emit('EXIT_GAME'); },
      isMuted: function () { return isMuted; }
    };
  }

  return {
    SOURCE_TAG: SOURCE_TAG,
    createGameClient: createGameClient
  };
}));
