const compression = require('compression');
const cors = require('cors');
const logger = require('./logger');
const headers = require('./headers');
const heartbeat = require('./heartbeat');
const staticAssets = require('./static-assets');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const minifyHTML = require('express-minify-html');

function levelFn(status) {
	if (status >= 500) {
		// fastboot-server internal error or error
		return 'error';
	} else if (status >= 400) {
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
		app.use('/article-preview', bodyParser.urlencoded({extended: true, limit: '10mb'}));
		app.use('/article-preview', methodOverride(() => {
			return 'GET';
		}));

		app.use('/mobile-wiki', cors(), staticAssets);
		app.use('/heartbeat', heartbeat);
		app.use('/wiki/*', minifyHTML({
			override: true,
			htmlMinifier: {
				collapseWhitespace: true,
				collapseBooleanAttributes: true,
				decodeEntities: true,
				minifyJS: true,
				quoteCharacter: '"',
				removeComments: true,
				removeAttributeQuotes: true,
				removeEmptyAttributes: true,
				removeOptionalTags: true,
				removeRedundantAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true,
				sortAttributes: true,
				sortClassName: true
			},
			exception_url: [
				/\?nominify/i,
				function (request) {
					return request.get('Cookie').indexOf(/access_token=[^;]+/i) > -1;
				}
			]
		}));
	},

	after(app) {
		app.use((err, req, res, next) => {
			if (err) {
				// Handle errors that don't go to FastBoot, like Bad Request etc.
				const statusCode = Math.max(res.statusCode, err.statusCode || 500);
				const level = levelFn(statusCode);
				const logFn = req.log[level].bind(req.log);

				logFn(err);

				res.sendStatus(statusCode);
			}
		});
	}
};
