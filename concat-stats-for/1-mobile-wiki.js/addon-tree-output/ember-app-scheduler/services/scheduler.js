define('ember-app-scheduler/services/scheduler', ['exports', 'ember'], function (exports, _ember) {
  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var run = _ember['default'].run;
  var RSVP = _ember['default'].RSVP;
  var Service = _ember['default'].Service;

  var Token = (function () {
    function Token() {
      _classCallCheck(this, Token);

      this._cancelled = false;
    }

    _createClass(Token, [{
      key: 'cancel',
      value: function cancel() {
        this._cancelled = true;
      }
    }, {
      key: 'cancelled',
      get: function get() {
        return this._cancelled;
      }
    }]);

    return Token;
  })();

  var Queue = (function () {
    function Queue() {
      _classCallCheck(this, Queue);

      this.reset();
    }

    _createClass(Queue, [{
      key: 'reset',
      value: function reset() {
        this.tasks = [];
        this.isActive = true;
        this.afterPaintDeferred = RSVP.defer();
        this.afterPaintPromise = this.afterPaintDeferred.promise;
      }
    }]);

    return Queue;
  })();

  exports['default'] = Service.extend({
    queueNames: ['afterFirstRoutePaint', 'afterContentPaint'],

    init: function init() {
      this._super();
      this._nextPaintFrame = null;
      this._nextPaintTimeout = null;
      this._nextAfterPaintPromise = null;
      this._routerWillTransitionHandler = null;
      this._routerDidTransitionHandler = null;
      this._initQueues();
      this._connectToRouter();
      this._useRAF = typeof requestAnimationFrame === "function";
    },

    scheduleWork: function scheduleWork(queueName, callback) {
      var queue = this.queues[queueName];
      var token = new Token();

      if (queue.isActive) {
        queue.tasks.push(callback);
        queue.tasks.push(token);
      } else {
        callback();
      }

      return token;
    },

    cancelWork: function cancelWork(token) {
      token.cancel();
    },

    flushQueue: function flushQueue(queueName) {
      var queue = this.queues[queueName];
      queue.isActive = false;

      for (var i = 0; i < queue.tasks.length; i += 2) {
        var callback = queue.tasks[i];
        var token = queue.tasks[i + 1];

        if (!token.cancelled) {
          callback();
        }
      }

      this._afterNextPaint().then(function () {
        queue.afterPaintDeferred.resolve();
      });
    },

    _initQueues: function _initQueues() {
      var queues = this.queues = Object.create(null);
      var queueNames = this.queueNames;

      for (var i = 0; i < queueNames.length; i++) {
        queues[queueNames[i]] = new Queue();
      }
    },

    _resetQueues: function _resetQueues() {
      var queues = this.queues;
      var queueNames = this.queueNames;

      for (var i = 0; i < queueNames.length; i++) {
        queues[queueNames[i]].reset();
      }
    },

    _afterNextPaint: function _afterNextPaint() {
      var _this = this;

      if (this._nextAfterPaintPromise) {
        return this._nextAfterPaintPromise;
      }

      this._nextAfterPaintPromise = new RSVP.Promise(function (resolve) {
        if (_this._useRAF) {
          _this._nextPaintFrame = requestAnimationFrame(function () {
            return _this._rAFCallback(resolve);
          });
        } else {
          _this._rAFCallback(resolve);
        }
      });

      return this._nextAfterPaintPromise;
    },

    _rAFCallback: function _rAFCallback(resolve) {
      var _this2 = this;

      this._nextPaintTimeout = run.later(function () {
        _this2._nextAfterPaintPromise = null;
        _this2._nextPaintFrame = null;
        _this2._nextPaintTimeout = null;
        resolve();
      }, 0);
    },

    _connectToRouter: function _connectToRouter() {
      var _this3 = this;

      var router = this.get('router');

      this._routerWillTransitionHandler = function () {
        _this3._resetQueues();
      };

      this._routerDidTransitionHandler = function () {
        _this3._afterNextPaint().then(function () {
          _this3.flushQueue('afterFirstRoutePaint');
          _this3._afterNextPaint().then(function () {
            _this3.flushQueue('afterContentPaint');
          });
        });
      };

      router.on('willTransition', this._routerWillTransitionHandler);
      router.on('didTransition', this._routerDidTransitionHandler);
    },

    willDestroy: function willDestroy() {
      this._super();
      var router = this.get('router');
      this.queues = null; // don't hold any references to uncompleted items

      router.off('willTransition', this._routerWillTransitionHandler);
      router.off('didTransition', this._routerDidTransitionHandler);

      if (this._useRAF) {
        cancelAnimationFrame(this._nextPaintFrame);
      }
      run.cancel(this._nextPaintTimeout);
    }
  });
});