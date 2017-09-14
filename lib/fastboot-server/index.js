const middlewares = require('../../fastboot-server/middlewares');

module.exports = {
	name: 'fastboot-server',

	serverMiddleware(startOptions) {
		const app = startOptions.app;

		middlewares.before(app);
		middlewares.after(app);
	}
};
