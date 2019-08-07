'use strict';

const assetsFolder = 'mobile-wiki/assets';

module.exports = {
  'mobile-wiki.js': {
    pattern: `${assetsFolder}/mobile-wiki-*.js`,
    limit: '475KB',
  },
  'vendor.js': {
    pattern: `${assetsFolder}/vendor-*.js`,
    limit: '666KB',
  },
  'app.css': {
    pattern: `${assetsFolder}/app.css`,
    limit: '101KB',
  },
  'lazy.css': {
    pattern: `${assetsFolder}/lazy-*.css`,
    limit: '70KB',
  },
  'dark.css': {
    pattern: `${assetsFolder}/dark-*.css`,
    limit: '70KB',
  },
  'jwplayer:css': {
    pattern: `${assetsFolder}/jwplayer/*.css`,
    limit: '19KB',
  },
  'design-system.svg': {
    pattern: `${assetsFolder}/design-system-*.svg`,
    limit: '31KB',
  },
  'jwplayer:js': {
    pattern: `${assetsFolder}/jwplayer/*.js`,
    limit: '55KB',
  },
};
