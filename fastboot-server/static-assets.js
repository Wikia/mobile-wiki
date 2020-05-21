const expressStaticGzip = require('express-static-gzip');
const config = require('../config/fastboot-server');

module.exports = expressStaticGzip(config.distPath, {
  enableBrotli: true,
  serveStatic: {
    setHeaders: (res) => {
      res.set('Cache-Control', `s-maxage=${config.staticAssetsTTL}`);
      res.set('X-Pass-Cache-Control', `public, max-age=${config.staticAssetsTTL}`);
    },
  },
});
