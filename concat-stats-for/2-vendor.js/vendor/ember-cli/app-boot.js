
if (typeof FastBoot === 'undefined') {
  if (!runningTests) {
    require('mobile-wiki/app')['default'].create({"name":"mobile-wiki","version":"0.0.0+bcec7b92"});
  }
}

define('~fastboot/app-factory', ['mobile-wiki/app', 'mobile-wiki/config/environment'], function(App, config) {
  App = App['default'];
  config = config['default'];

  return {
    'default': function() {
      return App.create(config.APP);
    }
  };
});

var define = define; var require = require;
