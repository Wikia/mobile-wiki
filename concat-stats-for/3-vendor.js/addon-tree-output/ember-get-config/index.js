define('ember-get-config/index', ['exports', 'mobile-wiki/config/environment'], function (exports, _mobileWikiConfigEnvironment) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _mobileWikiConfigEnvironment['default'];
    }
  });
});