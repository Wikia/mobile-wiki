const FastBootAppServer = require('fastboot-app-server');
const express = require('express');
const config = require('./config/fastboot-server');
const logger = require('./server/logger');
const headers = require('./server/headers');
const heartbeat = require('./server/heartbeat');
const staticAssets = require('./server/static-assets');

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
