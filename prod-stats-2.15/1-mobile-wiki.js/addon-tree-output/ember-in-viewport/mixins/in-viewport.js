define('ember-in-viewport/mixins/in-viewport', ['exports', 'ember', 'ember-in-viewport/utils/can-use-dom', 'ember-in-viewport/utils/can-use-raf', 'ember-in-viewport/utils/is-in-viewport', 'ember-in-viewport/utils/check-scroll-direction'], function (exports, _ember, _emberInViewportUtilsCanUseDom, _emberInViewportUtilsCanUseRaf, _emberInViewportUtilsIsInViewport, _emberInViewportUtilsCheckScrollDirection) {
  var Mixin = _ember['default'].Mixin;
  var setProperties = _ember['default'].setProperties;
  var typeOf = _ember['default'].typeOf;
  var assert = _ember['default'].assert;
  var $ = _ember['default'].$;
  var get = _ember['default'].get;
  var set = _ember['default'].set;
  var _Ember$run = _ember['default'].run;
  var scheduleOnce = _Ember$run.scheduleOnce;
  var debounce = _Ember$run.debounce;
  var bind = _Ember$run.bind;
  var next = _Ember$run.next;
  var not = _ember['default'].computed.not;
  var getOwner = _ember['default'].getOwner;

  var assign = _ember['default'].assign || _ember['default'].merge;

  var rAFIDS = {};
  var lastDirection = {};
  var lastPosition = {};

  exports['default'] = Mixin.create({
    viewportExited: not('viewportEntered').readOnly(),

    init: function init() {
      this._super.apply(this, arguments);
      var options = assign({
        viewportUseRAF: (0, _emberInViewportUtilsCanUseRaf['default'])(),
        viewportEntered: false,
        viewportListeners: []
      }, this._buildOptions());

      setProperties(this, options);
    },

    didInsertElement: function didInsertElement() {
      this._super.apply(this, arguments);

      if (!_emberInViewportUtilsCanUseDom['default']) {
        return;
      }

      var viewportEnabled = get(this, 'viewportEnabled');
      if (viewportEnabled) {
        this._startListening();
      }
    },

    willDestroyElement: function willDestroyElement() {
      this._super.apply(this, arguments);
      this._unbindListeners();
    },

    _buildOptions: function _buildOptions() {
      var defaultOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var owner = getOwner(this);

      if (owner) {
        return assign(defaultOptions, owner.lookup('config:in-viewport'));
      }
    },

    _startListening: function _startListening() {
      var _this = this;

      this._setInitialViewport(window);
      this._addObserverIfNotSpying();
      this._bindScrollDirectionListener(window, get(this, 'viewportScrollSensitivity'));

      if (!get(this, 'viewportUseRAF')) {
        get(this, 'viewportListeners').forEach(function (listener) {
          var context = listener.context;
          var event = listener.event;

          _this._bindListeners(context, event);
        });
      }
    },

    _addObserverIfNotSpying: function _addObserverIfNotSpying() {
      if (!get(this, 'viewportSpy')) {
        this.addObserver('viewportEntered', this, this._unbindIfEntered);
      }
    },

    _setViewportEntered: function _setViewportEntered() {
      var context = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      assert('You must pass a valid context to _setViewportEntered', context);

      var element = get(this, 'element');

      if (!element) {
        return;
      }

      var $contextEl = $(context);
      var boundingClientRect = element.getBoundingClientRect();

      this._triggerDidAccessViewport((0, _emberInViewportUtilsIsInViewport['default'])(boundingClientRect, $contextEl.innerHeight(), $contextEl.innerWidth(), get(this, 'viewportTolerance')));

      if (boundingClientRect && get(this, 'viewportUseRAF')) {
        rAFIDS[get(this, 'elementId')] = window.requestAnimationFrame(bind(this, this._setViewportEntered, context));
      }
    },

    _triggerDidScrollDirection: function _triggerDidScrollDirection() {
      var $contextEl = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
      var sensitivity = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

      assert('You must pass a valid context element to _triggerDidScrollDirection', $contextEl);
      assert('sensitivity cannot be 0', sensitivity);

      var elementId = get(this, 'elementId');
      var lastDirectionForEl = lastDirection[elementId];
      var lastPositionForEl = lastPosition[elementId];
      var newPosition = {
        top: $contextEl.scrollTop(),
        left: $contextEl.scrollLeft()
      };

      var scrollDirection = (0, _emberInViewportUtilsCheckScrollDirection['default'])(lastPositionForEl, newPosition, sensitivity);
      var directionChanged = scrollDirection !== lastDirectionForEl;

      if (scrollDirection && directionChanged && get(this, 'viewportEntered')) {
        this.trigger('didScroll', scrollDirection);
        lastDirection[elementId] = scrollDirection;
      }

      lastPosition[elementId] = newPosition;
    },

    _triggerDidAccessViewport: function _triggerDidAccessViewport() {
      var hasEnteredViewport = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var viewportEntered = get(this, 'viewportEntered');
      var didEnter = !viewportEntered && hasEnteredViewport;
      var didLeave = viewportEntered && !hasEnteredViewport;
      var triggeredEventName = '';

      if (didEnter) {
        triggeredEventName = 'didEnterViewport';
      }

      if (didLeave) {
        triggeredEventName = 'didExitViewport';
      }

      if (get(this, 'viewportSpy') || !viewportEntered) {
        set(this, 'viewportEntered', hasEnteredViewport);
      }

      this.trigger(triggeredEventName);
    },

    _unbindIfEntered: function _unbindIfEntered() {
      if (!get(this, 'viewportSpy') && get(this, 'viewportEntered')) {
        this._unbindListeners();
        this.removeObserver('viewportEntered', this, this._unbindIfEntered);
        set(this, 'viewportEntered', true);
      }
    },

    _setInitialViewport: function _setInitialViewport() {
      var _this2 = this;

      var context = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      assert('You must pass a valid context to _setInitialViewport', context);

      return scheduleOnce('afterRender', this, function () {
        _this2._setViewportEntered(context);
      });
    },

    _debouncedEventHandler: function _debouncedEventHandler(methodName) {
      var _this3 = this;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      assert('You must pass a methodName to _debouncedEventHandler', methodName);
      assert('methodName must be a string', typeOf(methodName) === 'string');

      debounce(this, function () {
        return _this3[methodName].apply(_this3, args);
      }, get(this, 'viewportRefreshRate'));
    },

    _bindScrollDirectionListener: function _bindScrollDirectionListener() {
      var _this4 = this;

      var context = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
      var sensitivity = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

      assert('You must pass a valid context to _bindScrollDirectionListener', context);
      assert('sensitivity cannot be 0', sensitivity);

      var $contextEl = $(context);

      $contextEl.on('scroll.directional#' + get(this, 'elementId'), function () {
        _this4._debouncedEventHandler('_triggerDidScrollDirection', $contextEl, sensitivity);
      });
    },

    _unbindScrollDirectionListener: function _unbindScrollDirectionListener() {
      var context = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      assert('You must pass a valid context to _bindScrollDirectionListener', context);

      var elementId = get(this, 'elementId');

      $(context).off('scroll.directional#' + elementId);
      delete lastPosition[elementId];
      delete lastDirection[elementId];
    },

    _bindListeners: function _bindListeners() {
      var _this5 = this;

      var context = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
      var event = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      assert('You must pass a valid context to _bindListeners', context);
      assert('You must pass a valid event to _bindListeners', event);

      $(context).on(event + '.' + get(this, 'elementId'), function () {
        _this5._debouncedEventHandler('_setViewportEntered', context);
      });
    },

    _unbindListeners: function _unbindListeners() {
      var elementId = get(this, 'elementId');

      if (get(this, 'viewportUseRAF')) {
        next(this, function () {
          window.cancelAnimationFrame(rAFIDS[elementId]);
          delete rAFIDS[elementId];
        });
      }

      get(this, 'viewportListeners').forEach(function (listener) {
        var context = listener.context;
        var event = listener.event;

        $(context).off(event + '.' + elementId);
      });

      this._unbindScrollDirectionListener(window);
    }
  });
});