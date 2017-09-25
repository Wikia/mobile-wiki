/**
 * Heapdump can be enabled by chef when there is need to debug a memory leak
 * To create a heapdump, send `kill -SIGUSR2` to FastBoot process
 * Make sure that server's CWD is writable, if there is no heapdump created then it's not
 *
 * See https://github.com/bnoordhuis/node-heapdump
 */
if (process.env.HEAPDUMP_ENABLED === 'true') {
	require('heapdump');
}

/**
 * NewRelic is only enabled on one fastboot-server and that logic is managed by chef,
 * which passes it to our config
 */
if (process.env.NEW_RELIC_ENABLED === 'true') {
	require('newrelic');
}

// TODO after full rollout change path to REPO ROOT
const FastBootAppServer = require('fastboot-app-server');
const config = require('../../config/fastboot-server');
const middlewares = require('../middlewares');

process.env.PORT = config.port;

const server = new FastBootAppServer({
	beforeMiddleware: middlewares.before,
	afterMiddleware: middlewares.after,
	distPath: config.distPath,
	gzip: true
});

server.start();
