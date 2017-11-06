define('ember-router-scroll/services/router-scroll', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Service = Ember.Service;
  var getWithDefault = Ember.getWithDefault;
  var computed = Ember.computed;
  var set = Ember.set;
  var get = Ember.get;
  var getOwner = Ember.getOwner,
      typeOf = Ember.typeOf;
  exports.default = Service.extend({
    scrollElement: 'window',

    init: function init() {
      this._super.apply(this, arguments);
      this._loadConfig();
      set(this, 'scrollMap', {});
      set(this, 'key', null);
    },
    update: function update() {
      var scrollElement = get(this, 'scrollElement');
      var scrollMap = get(this, 'scrollMap');
      var key = get(this, 'key');
      var x = void 0;
      var y = void 0;

      if ('window' === scrollElement) {
        x = window.scrollX;
        y = window.scrollY;
      } else if ('#' === scrollElement.charAt(0)) {
        var element = document.getElementById(scrollElement.substring(1));

        if (element) {
          x = element.scrollLeft;
          y = element.scrollTop;
        }
      }

      if (key && 'number' === typeOf(x) && 'number' === typeOf(y)) {
        set(scrollMap, key, { x: x, y: y });
      }
    },


    position: computed(function position() {
      var scrollMap = get(this, 'scrollMap');
      var stateUuid = get(window, 'history.state.uuid');

      set(this, 'key', stateUuid);
      var key = getWithDefault(this, 'key', '-1');

      return getWithDefault(scrollMap, key, { x: 0, y: 0 });
    }).volatile(),

    _loadConfig: function _loadConfig() {
      var config = getOwner(this).resolveRegistration('config:environment');

      if (config && config.routerScroll && config.routerScroll.scrollElement) {
        var scrollElement = config.routerScroll.scrollElement;

        if ('string' === typeOf(config.routerScroll.scrollElement)) {
          set(this, 'scrollElement', config.routerScroll.scrollElement);
        }
      }
    }
  });
});