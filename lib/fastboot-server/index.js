'use strict';

const middlewares = require('../../fastboot-server/middlewares');

module.exports = {
  name: 'fastboot-server',

  serverMiddleware({ app }) {
    middlewares.before(app);
    middlewares.after(app);
  },
};
