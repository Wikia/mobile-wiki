const cluster = require('cluster');
const express = require('express');
const promBundle = require('express-prom-bundle');
// TODO after full rollout change path to REPO ROOT
const FastBootAppServer = require('fastboot-app-server');
const config = require('../../config/fastboot-server');
const middlewares = require('../middlewares');

process.env.PORT = config.port;

const server = new FastBootAppServer({
  beforeMiddleware: middlewares.before,
  afterMiddleware: middlewares.after,
  distPath: config.distPath,
  gzip: true,
});

server.start();

// since we run in cluster mode, express-prom-bundle needs to be used in specific way, see
// https://github.com/jochen-schweizer/express-prom-bundle#using-with-cluster
if (cluster.isMaster) {
  const metricsApp = express();

  metricsApp.use('/metrics', promBundle.clusterMetrics());
  metricsApp.listen(8007);
}
