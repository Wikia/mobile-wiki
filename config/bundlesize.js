'use strict';

const assetsFolder = 'mobile-wiki/assets';

module.exports = {
  'mobile-wiki.js': {
    pattern: `${assetsFolder}/mobile-wiki-*.js`,
    limit: '447KB',
  },
  'vendor.js': {
    pattern: `${assetsFolder}/vendor-*.js`,
    limit: '656KB',
  },
  'app.css': {
    pattern: `${assetsFolder}/app.css`,
    limit: '90KB',
  },
  'lazy.css': {
    pattern: `${assetsFolder}/lazy-*.css`,
    limit: '68KB',
  },
  'jwplayer:css': {
    pattern: `${assetsFolder}/jwplayer/*.css`,
    limit: '19KB',
  },
  'design-system.svg': {
    pattern: `${assetsFolder}/design-system-*.svg`,
    limit: '29KB',
  },
  'jwplayer:js': {
    pattern: `${assetsFolder}/jwplayer/*.js`,
    limit: '55KB',
  },
};
