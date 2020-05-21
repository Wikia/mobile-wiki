/* eslint-env node */

'use strict';

module.exports = function (deployTarget) {
  const ENV = {
    build: {
      outputPath: 'dist/mobile-wiki',
    },
    // include other plugin configuration that applies to all deploy targets here
    compress: {
      compression: ['gzip', 'brotli'],
      keep: true,
    },
  };

  if (deployTarget === 'development') {
    ENV.build.environment = 'development';
    // configure other plugins for development deploy target here
  }

  if (deployTarget === 'production') {
    ENV.build.environment = 'production';
    // configure other plugins for production deploy target here
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
