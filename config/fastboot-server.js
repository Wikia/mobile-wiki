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
    if (process.env.MOBILE_WIKI_LOG_TCP_PORT || process.env.MOBILE_WIKI_LOG_TCP_HOST) {
      config.loggers = {
        tcpStream: {
          port: process.env.MOBILE_WIKI_LOG_TCP_PORT,
          host: process.env.MOBILE_WIKI_LOG_TCP_HOST,
          minLogLevel: 'debug',
        },
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
