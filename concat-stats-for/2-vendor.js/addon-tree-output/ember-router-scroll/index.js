define('ember-router-scroll/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var Mixin = Ember.Mixin;
  var get = Ember.get;
  var computed = Ember.computed;
  var inject = Ember.inject.service;
  var getOwner = Ember.getOwner;
  exports.default = Mixin.create({
    scheduler: inject('scheduler'),
    service: inject('router-scroll'),

    isFastBoot: computed(function () {
      var fastboot = getOwner(this).lookup('service:fastboot');
      return fastboot ? fastboot.get('isFastBoot') : false;
    }),

    willTransition: function willTransition() {
      this._super.apply(this, arguments);
      get(this, 'service').update();
    },
    didTransition: function didTransition(transitions) {
      var _this = this;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      this._super.apply(this, [transitions].concat(_toConsumableArray(args)));

      if (get(this, 'isFastBoot')) {
        return;
      }

      this.get('scheduler').scheduleWork('afterContentPaint', function () {
        _this.updateScrollPosition(transitions);
      });
    },
    updateScrollPosition: function updateScrollPosition(transitions) {
      var scrollElement = get(this, 'service.scrollElement');
      var scrollPosition = get(this, 'service.position');

      var preserveScrollPosition = transitions[transitions.length - 1].handler.controller.get('preserveScrollPosition');

      if (!preserveScrollPosition) {
        if ('window' === scrollElement) {
          window.scrollTo(scrollPosition.x, scrollPosition.y);
        } else if ('#' === scrollElement.charAt(0)) {
          var element = document.getElementById(scrollElement.substring(1));

          if (element) {
            element.scrollLeft = scrollPosition.x;
            element.scrollTop = scrollPosition.y;
          }
        }
      }
    }
  });
});