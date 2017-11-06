
if (typeof FastBoot === 'undefined') {
  if (!runningTests) {
    require('mobile-wiki/app')['default'].create({"LOG_RESOLVER":false,"LOG_ACTIVE_GENERATION":true,"LOG_TRANSITIONS":true,"LOG_TRANSITIONS_INTERNAL":true,"LOG_VIEW_LOOKUPS":true,"name":"mobile-wiki","version":"0.0.0+6cc2799c"});
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
