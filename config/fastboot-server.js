'use strict';

module.exports = (function () {
  const config = {
    distPath: 'dist/mobile-wiki',
    loggers: {},
    // 30 days in seconds
    staticAssetsTTL: 2.592e+6,
    port: 8001,
    servicesDomain: 'services.wikia.com',
  };

  if (process.env.WIKIA_ENVIRONMENT === 'dev') {
    const devDomain = (process.env.WIKIA_DATACENTER === 'poz') ? 'pl' : 'us';
    if (process.env.MOBILE_WIKI_LOG_TO_FILE) {
      config.loggers = {
        debugFile: process.env.MOBILE_WIKI_LOG_TO_FILE,
      };
    } else {
      config.loggers = {
        console: 'debug',
      };
    }
    config.servicesDomain = `services.wikia-dev.${devDomain}`;
    config.port = 7001;
  }

  if (process.env.IMAGE_VERSION) {
    config.app_version = process.env.IMAGE_VERSION;
  }

  return config;
}());
