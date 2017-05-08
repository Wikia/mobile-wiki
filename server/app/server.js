/**
 * NewRelic is only enabled on one server and that logic is managed by chef,
 * which passes it to our config
 */
if (process.env.NEW_RELIC_ENABLED === 'true') {
	require('newrelic');
}

// TODO after full rollout change path to REPO ROOT
const FastBootAppServer = require('fastboot-app-server');
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const config = require('../../config/fastboot-server');
const logger = require('../logger');
const headers = require('../headers');
const heartbeat = require('../heartbeat');
const staticAssets = require('../static-assets');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');

function levelFn(status) {
	if (status >= 500) {
		// server internal error or error
		return 'error';
	} else if (status >= 400) {
		// client error
		return 'warn';
	}

	return 'info';
}

process.env.PORT = config.port;

const server = new FastBootAppServer({
	beforeMiddleware: (app) => {
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
	},
	afterMiddleware: (app) => {
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
	},
	distPath: config.distPath,
	gzip: true
});

server.start();
