const compression = require('compression');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const promBundle = require('express-prom-bundle');
const cors = require('cors');
const logger = require('./logger');
const headers = require('./headers');
const heartbeat = require('./heartbeat');
const staticAssets = require('./static-assets');

const metricsMiddleware = promBundle({
  includePath: true,
  promClient: {
    collectDefaultMetrics: {
      timeout: 10000,
    },
  },
  buckets: [0.003, 0.03, 0.1, 0.3, 1.2, 10],
});

function levelFn(status) {
  if (status >= 500) {
    // fastboot-server internal error or error
    return 'error';
  }
  if (status >= 400) {
    // client error
    return 'warn';
  }

  return 'info';
}

module.exports = {
  before(app) {
    app.use(compression());
    app.disable('x-powered-by');
    app.use(logger);

    app.use(headers);

    /**
   * Special handling for article-preview route.
   * Fastboot doesn't support POST requests so we rewrite them on express to GET
   * Additionally we have to enable POST body parser for this route to get data that was posted
   */
    app.use(metricsMiddleware);
    app.use(
      /^(\/[a-z]{2,3}(?:-[a-z-]{2,12})?)?\/article-preview/,
      bodyParser.urlencoded({ extended: true, limit: '10mb' }),
    );
    app.use(/^(\/[a-z]{2,3}(?:-[a-z-]{2,12})?)?\/article-preview/, methodOverride(() => 'GET'));

    // XF-242 remove /mobile-wiki path after full migration to serving assets from DFS
    app.use('/mobile-wiki', cors(), staticAssets);
    app.use('/mobile-wiki-assets', cors(), staticAssets);
    app.use('/heartbeat', heartbeat);
  },

  after(app) {
    app.use((err, req, res, next) => {
      if (err) {
        // Handle errors that don't go to FastBoot, like Bad Request etc.
        const statusCode = Math.max(res.statusCode, err.statusCode || 500);
        const level = levelFn(statusCode);

        if (req.log) {
          const logFn = req.log[level].bind(req.log);
          logFn(err);
        } else {
          // eslint-disable-next-line no-console
          console.error(err);
        }

        res.sendStatus(statusCode);
      } else {
        next();
      }
    });
  },
};
