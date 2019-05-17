const promBundle = require('express-prom-bundle');
const url = require('url');

module.exports = promBundle({
  autoregister: false,
  includePath: true,
  normalizePath(req) {
    const path = url.parse(req.originalUrl || req.url).pathname;

    if (path.match(/^(\/[a-z]{2,3}(?:-[a-z-]{2,12})?)?\/wiki/)) {
      return '/wiki/#article';
    }

    if (path.match(/^\/mobile-wiki/)) {
      return 'assets';
    }

    if (path.match(/^\/heartbeat/)) {
      return 'heartbeat';
    }

    if (path.match(/^(\/[a-z]{2,3}(?:-[a-z-]{2,12})?)?\/search/)) {
      return '/search';
    }

    if (path.match(/^(\/[a-z]{2,3}(?:-[a-z-]{2,12})?)?\/article-preview/)) {
      return '/article-preview';
    }

    if (path.match(/^\/metrics/)) {
      return '/metrics';
    }

    return 'misc';
  },
  promClient: {
    collectDefaultMetrics: {
      timeout: 10000,
    },
  },
  buckets: [0.003, 0.03, 0.1, 0.3, 1.2, 10],
});
