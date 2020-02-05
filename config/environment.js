'use strict';

module.exports = function (environment) {
  const ENV = {
    appName: 'mobile-wiki',
    modulePrefix: 'mobile-wiki',
    environment,
    locationType: 'router-scroll',
    historySupportMiddleware: true,
    EmberENV: {
      EXTEND_PROTOTYPES: {
        Array: true,
        String: false,
        Function: false,
      },
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
    },
    APP: {
      facebook: {
        appId: '112328095453510',
      },
      heliosTimeout: 3000,
      baseDomainRegex: '((wikia|fandom)\\.com|wikia\\.org|(wikia|fandom)-dev\\.(com|us|pl))',
      tracking: {
        ua: {
          accounts: {
            primary: {
              id: 'UA-32129070-1',
              sampleRate: 100,
            },
            ads: {
              prefix: 'ads',
              id: 'UA-32129071-1',
              sampleRate: 100,
            },
          },
          scriptUrl: 'https://www.google-analytics.com/analytics.js',
        },
        quantcast: {
          id: 'p-8bG6eLqkH6Avk',
          labels: 'Category.MobileWeb.Mercury',
        },
        comscore: {
          keyword: 'comscorekw',
          id: '6177433',
          c7: '',
          c7Value: '',
        },
      },
      translationsNamespaces: ['main', 'search', 'design-system'],
      translationsPath: 'dist/mobile-wiki/locales',
    },
    fastboot: {
      hostWhitelist: [
        /mobile-wiki-.*\.(dev|prod)\.(poz-dev|poz|sjc-dev|sjc|res)\.k8s\.wikia\.net/,
        /.*\.(wikia-dev|fandom-dev)\.(pl|us)/,
        /.*\.wikia\.(com|org)/,
        /.*\.fandom\.com/,
        /^localhost:\d+$/,
      ],
    },
  };

  if (environment === 'development') {
    ENV.APP.LOG_RESOLVER = false;
    ENV.APP.LOG_ACTIVE_GENERATION = true;
    ENV.APP.LOG_TRANSITIONS = true;
    ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;

    ENV.APP.facebook.appId = '881967318489580';

    ENV['ember-cli-mirage'] = {
      enabled: false,
    };
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.rootURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;

    ENV['ember-cli-mirage'] = {
      autostart: true,
    };
  }

  if (process.env.IMAGE_VERSION) {
    ENV.APP.version = process.env.IMAGE_VERSION;
  }

  return ENV;
};
