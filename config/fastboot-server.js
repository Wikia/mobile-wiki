module.exports = (function () {
	const config = {
		distPath: 'dist/mobile-wiki',
		loggers: {},
		// 30 days in seconds
		staticAssetsTTL: 2.592e+6,
		port: 8001
	};

	if (process.env.WIKIA_ENVIRONMENT === 'dev') {
		config.loggers = {
			console: 'debug'
		};
		config.port = 7001;
	}

	if (process.env.IMAGE_VERSION) {
		config.app_version = process.env.IMAGE_VERSION;
	}

	return config;
})();
