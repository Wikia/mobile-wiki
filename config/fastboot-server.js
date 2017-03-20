module.exports = function () {
	const config = {
		distPath: 'dist/mobile-wiki',
		loggers: {
			syslog: 'warn'
		},
		// 30 days in seconds
		staticAssetsTTL: 2.592e+6
	};

	if (process.env.WIKIA_ENVIRONMENT === 'dev') {
		config.loggers = {
			console: 'debug'
		};
	}

	return config;
}();
