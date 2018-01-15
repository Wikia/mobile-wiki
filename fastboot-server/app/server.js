// TODO after full rollout change path to REPO ROOT
const FastBootAppServer = require('fastboot-app-server');
const config = require('../../config/fastboot-server');
const middlewares = require('../middlewares');

process.env.PORT = config.port;

const server = new FastBootAppServer({
	beforeMiddleware: middlewares.before,
	afterMiddleware: middlewares.after,
	distPath: config.distPath
});

server.start();
