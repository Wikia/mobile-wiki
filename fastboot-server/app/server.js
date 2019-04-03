// TODO after full rollout change path to REPO ROOT
const FastBootAppServer = require('fastboot-app-server');
// const memwatch = require('memwatch-next');
const config = require('../../config/fastboot-server');
const middlewares = require('../middlewares');

process.env.PORT = config.port;


const server = new FastBootAppServer({
  beforeMiddleware: middlewares.before,
  afterMiddleware: middlewares.after,
  distPath: config.distPath,
  gzip: true,
});

// memwatch.on('leak', (info) => {
//   info.appname = 'mobile-wiki';
//   console.log(info);
// });
//
// memwatch.on('stats', (stats) => {
//   stats.appname = 'mobile-wiki';
//   console.log(stats);
// });

server.start();
