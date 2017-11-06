define('mobile-wiki/locations/none', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed,
      _Ember$computed = Ember.computed,
      bool = _Ember$computed.bool,
      readOnly = _Ember$computed.readOnly,
      service = Ember.inject.service,
      get = Ember.get,
      getOwner = Ember.getOwner;


  var TEMPORARY_REDIRECT_CODE = 307;

  exports.default = Ember.NoneLocation.extend({
    implementation: 'fastboot',
    fastboot: service(),

    _config: computed(function () {
      return getOwner(this).resolveRegistration('config:environment');
    }),

    _fastbootHeadersEnabled: bool('_config.fastboot.fastbootHeaders'),

    _redirectCode: computed(function () {
      return get(this, '_config.fastboot.redirectCode') || TEMPORARY_REDIRECT_CODE;
    }),

    _response: readOnly('fastboot.response'),
    _request: readOnly('fastboot.request'),

    setURL: function setURL(path) {
      if (get(this, 'fastboot.isFastBoot')) {
        var response = get(this, '_response');
        var currentPath = get(this, 'path');
        var isInitialPath = !currentPath || currentPath.length === 0;

        if (!isInitialPath) {
          path = this.formatURL(path);
          var isTransitioning = currentPath !== path;

          if (isTransitioning) {
            var host = get(this, '_request.host');
            var redirectURL = '//' + host + path;

            response.statusCode = this.get('_redirectCode');
            response.headers.set('location', redirectURL);
          }
        }

        // for testing and debugging
        if (get(this, '_fastbootHeadersEnabled')) {
          response.headers.set('x-fastboot-path', path);
        }
      }

      this._super.apply(this, arguments);
    }
  });
});