const FastBootAppServer = require('fastboot-app-server');
const express = require('express');
const config = require('./config/fastboot-server');
const logger = require('./server/logger');
const headers = require('./server/headers');
const heartbeat = require('./server/heartbeat');
const staticAssets = require('./server/static-assets');
const methodOverride = require('method-override');
const bodyParser = require('body-parser')

function levelFn(status, err) {
	if (err || status >= 500) {
		// server internal error or error
		return 'error';
	} else if (status >= 400) {
		// client error
		return 'warn';
	}
	return 'info';
}

const server = new FastBootAppServer({
	beforeMiddleware: (app) => {
		app.use(logger);
		app.use(headers);
		/**
		 * Special handling for article-preview route.
		 * Fastboot doesn't support POST requests so we rewrite them on express to GET
		 * Additionally we have to enable POST body parser for this route to get data that was posted
		 */
		app.use('/article-preview', bodyParser.urlencoded({extended: true}));
		app.use('/article-preview', methodOverride(function() {
			return 'GET';
		}));
		app.use('/mobile-wiki', staticAssets);
		app.use('/heartbeat', heartbeat);
	},
	afterMiddleware: (app) => {
		app.use(function (err, req, res, next) {
			if (err) {
				const level = levelFn(res.statusCode, err);
				const logFn = req.log[level].bind(req.log);

				logFn(err);

				// TODO make it pretty
				res.send('Server error');
			}
		});
	},
	distPath: config.distPath,
	gzip: true
});

server.start();
