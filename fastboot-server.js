const FastBootAppServer = require('fastboot-app-server');
const express = require('express');
const logger = require('./server/logger');
const headers = require('./server/headers');
const heartbeat = require('./server/heartbeat');
const distPath = 'dist/mobile-wiki';

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
		app.use('/mobile-wiki', express.static(distPath));
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
	distPath,
	gzip: true
});

server.start();
