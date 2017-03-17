const FastBootAppServer = require('fastboot-app-server');
const express = require('express');
const logger = require('./server/logger');
const headers = require('./server/headers');
const distPath = 'dist/mobile-wiki';

const server = new FastBootAppServer({
	beforeMiddleware: (app) => {
		app.use(logger);
		app.use(headers);
		app.use('/mobile-wiki', express.static(distPath));
	},
	distPath,
	gzip: true
});

server.start();
