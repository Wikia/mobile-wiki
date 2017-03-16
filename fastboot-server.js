const FastBootAppServer = require('fastboot-app-server');
const express = require('express');
const distPath = 'dist/mobile-wiki';

const server = new FastBootAppServer({
	beforeMiddleware: (app) => {
		app.use('/mobile-wiki', express.static(distPath));
	},
	distPath,
	gzip: true
});

server.start();
