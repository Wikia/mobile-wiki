module.exports = function () {
	const config = {
		loggers: {
			syslog: 'warn'
		}
	};

	if (process.env.WIKIA_ENVIRONMENT === 'dev') {
		config.loggers = {
			console: 'debug'
		};
	}

	return config;
}();
