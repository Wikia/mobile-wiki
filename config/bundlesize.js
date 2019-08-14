'use strict';

const assetsFolder = 'mobile-wiki/assets';

module.exports = {
  'mobile-wiki.js': {
    pattern: `${assetsFolder}/mobile-wiki-*.js`,
    limit: '476KB',
  },
  'vendor.js': {
    pattern: `${assetsFolder}/vendor-*.js`,
    limit: '667KB',
  },
  'app.css': {
    pattern: `${assetsFolder}/app.css`,
    limit: '102KB',
  },
  'lazy.css': {
    pattern: `${assetsFolder}/lazy-*.css`,
    limit: '70KB',
  },
  'dark.css': {
    pattern: `${assetsFolder}/dark-*.css`,
    limit: '5KB',
  },
  'jwplayer:css': {
    pattern: `${assetsFolder}/jwplayer/*.css`,
    limit: '19KB',
  },
  'design-system.svg': {
    pattern: `${assetsFolder}/design-system-*.svg`,
    limit: '32KB',
  },
  'jwplayer:js': {
    pattern: `${assetsFolder}/jwplayer/*.js`,
    limit: '55KB',
  },
};
