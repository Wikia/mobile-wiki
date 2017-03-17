const FastBootAppServer = require('fastboot-app-server');
const express = require('express');
const logger = require('./server/logger');
const distPath = 'dist/mobile-wiki';

const server = new FastBootAppServer({
	beforeMiddleware: (app) => {
		app.use(logger);
		app.use('/mobile-wiki', express.static(distPath));
	},
	distPath,
	gzip: true
});

server.start();
