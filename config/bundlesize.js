'use strict';

const assetsFolder = 'mobile-wiki/assets';

module.exports = {
  'mobile-wiki.js': {
    pattern: `${assetsFolder}/mobile-wiki-*.js`,
    limit: '517KB',
  },
  'vendor.js': {
    pattern: `${assetsFolder}/vendor-*.js`,
    limit: '670KB',
  },
  'app.css': {
    pattern: `${assetsFolder}/app.css`,
    limit: '105KB',
  },
  'lazy.css': {
    pattern: `${assetsFolder}/lazy-*.css`,
    limit: '71KB',
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
    limit: '90KB',
  },
  'jwplayer:js': {
    pattern: `${assetsFolder}/jwplayer/*.js`,
    limit: '56KB',
  },
};
