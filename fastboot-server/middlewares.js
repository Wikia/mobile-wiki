const compression = require('compression');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('./logger');
const headers = require('./headers');
const heartbeat = require('./heartbeat');
const staticAssets = require('./static-assets');
const prometheus = require('./prometheus');

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

    // since we run in cluster mode, express-prom-bundle needs to be used in specific way, see
    // https://github.com/jochen-schweizer/express-prom-bundle#using-with-cluster
    app.use(prometheus.worker);

    /**
   * Special handling for article-preview route.
   * Fastboot doesn't support POST requests so we rewrite them on express to GET
   * Additionally we have to enable POST body parser for this route to get data that was posted
   */
    app.use(
      /^(\/[a-z]{2,3}(?:-[a-z-]{2,12})?)?\/article-preview/,
      bodyParser.urlencoded({ extended: true, limit: '10mb' }),
    );
    app.use(/^(\/[a-z]{2,3}(?:-[a-z-]{2,12})?)?\/article-preview/, methodOverride(() => 'GET'));

    app.use('/mobile-wiki', cors(), staticAssets);
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
