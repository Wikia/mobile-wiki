const promBundle = require('express-prom-bundle');

module.exports = promBundle({
  includePath: true,
  promClient: {
    collectDefaultMetrics: {
      timeout: 10000,
    },
  },
  buckets: [0.003, 0.03, 0.1, 0.3, 1.2, 10],
});
