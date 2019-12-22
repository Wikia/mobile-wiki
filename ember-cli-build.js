'use strict';

const { getAdEngineLoader } = require('@wikia/ad-engine/configs/webpack-app.config');
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const Funnel = require('broccoli-funnel');
const stew = require('broccoli-stew');
const SVGStore = require('broccoli-svgstore');
const nodeSass = require('node-sass');
const lazyloadedSVGs = require('./config/svg').lazyloadedSVGs;


/**
  * We override Ember's private method to remove files from the final build
  * which are added by addons but not used by us
  *
  * HEADS UP!
  * If you update ember-cli and something breaks,
  * the first thing you should try is to comment this out
  */
EmberApp.prototype.addonTreesFor = function (type) {
  return this.project.addons.map((addon) => {
    if (addon.treeFor) {
      let tree = addon.treeFor(type);

      if (tree) {
        // uncomment to see the files available to be filtered out
        // tree = stew.log(tree, {output: 'tree'});
        tree = stew.rm(
          tree,
          'modules/ember-types/asserts/**/*.js',
          'modules/ember-types/constants/*.js',
          'modules/ember-types/property/*.js',
          'ember-responds-to/mixins/responds-to-enter-keydown.js',
          'ember-responds-to/mixins/responds-to-esc-keydown.js',
          'ember-responds-to/mixins/responds-to-print.js',
        );
      }
      return tree;
    }

    return false;
  }).filter(Boolean);
};

module.exports = function (defaults) {
  const inlineScriptsPath = 'vendor/inline-scripts/';
  const app = new EmberApp(defaults, {
    babel: {
      plugins: [require.resolve('ember-auto-import/babel-plugin')],
    },
    autoImport: {
      publicAssetURL: '/mobile-wiki/assets',
      webpack: {
        module: {
          rules: [
            getAdEngineLoader(),
          ],
        },
      },
    },
    'ember-fetch': {
      preferNative: true,
    },
    autoprefixer: {
      cascade: false,
      map: false,
      remove: false,
    },
    fingerprint: {
      generateAssetMap: true,
      exclude: ['app.css'],
      extensions: ['js', 'css', 'svg', 'png', 'jpg', 'gif', 'map'],
      replaceExtensions: ['html', 'css', 'js', 'hbs'],
    },
    inlineContent: {
      'fastboot-inline-scripts-body-bottom': 'node_modules/mercury-shared/dist/body-bottom.js',
      'fastboot-inline-scripts': 'node_modules/mercury-shared/dist/head.js',
      'fastboot-inline-scripts-tracking': 'node_modules/mercury-shared/dist/tracking.js',
      'fastboot-inline-scripts-load-svg': 'node_modules/mercury-shared/dist/load-svg.js',
      'tracking-samba': `${inlineScriptsPath}tracking-samba.js`,
      'tracking-internal': `${inlineScriptsPath}tracking-internal.js`,
      'tracking-netzathleten': `${inlineScriptsPath}tracking-netzathleten.js`,
      'tracking-ua': `${inlineScriptsPath}tracking-ua.js`,
      'mediawiki-scripts-handlers': `${inlineScriptsPath}mediawiki-scripts-handlers.js`,
      lazysizes: `${inlineScriptsPath}lazysizes.js`,
      'rubik-font': `${inlineScriptsPath}rubik-font.js`,
      'featured-video': `${inlineScriptsPath}featured-video.js`,
    },
    outputPaths: {
      app: {
        css: {
          app: '/assets/app.css',
          lazy: '/assets/lazy.css',
          dark: '/assets/dark.css',
        },
        html: 'index.html',
      },
    },
    sassOptions: {
      implementation: nodeSass,
      includePaths: [
        'node_modules/design-system/dist/scss',
        'node_modules/@wikia/ad-engine/src/ad-products/styles',
      ],
      onlyIncluded: true,
    },
    stylelint: {
      testFailingFiles: true,
    },
    eslint: {
      testGenerator: 'qunit',
      group: true,
      rulesDir: '.',
      extensions: ['js'],
    },
    vendorFiles: {
      // This should be removed when ember-cli-shims is sunset
      'app-shims.js': null,
    },
  });

  const designSystemIcons = new Funnel('node_modules/design-system/style-guide/assets', {
    include: lazyloadedSVGs.map(icon => `${icon.name}.svg`),
  });
  const svgStore = new SVGStore(designSystemIcons, {
    outputFile: 'assets/design-system.svg',
    svgstoreOpts: {},
  });

  // Assets which are lazy loaded
  const designSystemI18n = new Funnel('node_modules/design-system/i18n', {
    destDir: 'locales',
  });

  const jwPlayerAssets = new Funnel('node_modules/jwplayer-fandom/dist', {
    destDir: 'assets/jwplayer',
  });

  const trackingOptIn = new Funnel('node_modules/@wikia/tracking-opt-in/dist', {
    // String `/assets/tracking-` is blocked by EasyPrivacy list
    destDir: 'assets/wikia-opt-in.min.js',
    include: ['tracking-opt-in.min.js'],
  });

  // Import files from node_modules, they will run both in FastBoot and browser
  app.import('node_modules/vignette/dist/vignette.js');
  app.import('vendor/polyfills.js', { prepend: true });

  // These will run only in browser
  app.import('node_modules/visit-source/dist/visit-source.js', {
    using: [{ transformation: 'fastbootShim' }],
  });
  app.import('node_modules/scriptjs/dist/script.min.js', {
    using: [{ transformation: 'fastbootShim' }],
  });
  app.import('node_modules/hammerjs/hammer.min.js', {
    using: [{ transformation: 'fastbootShim' }],
  });
  app.import('node_modules/ember-hammer/ember-hammer.js', {
    using: [{ transformation: 'fastbootShim' }],
  });
  app.import('node_modules/js-cookie/src/js.cookie.js', {
    using: [{ transformation: 'fastbootShim' }],
  });
  app.import('node_modules/lazysizes/lazysizes.js', {
    using: [{ transformation: 'fastbootShim' }],
  });
  app.import('node_modules/@wikia/search-tracking/dist/search-tracking.js', {
    using: [{ transformation: 'fastbootShim' }],
  });

  return app.toTree([
    designSystemI18n,
    svgStore,
    jwPlayerAssets,
    trackingOptIn,
  ]);
};
