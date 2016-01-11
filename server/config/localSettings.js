/**
 * Default localSettings for application
 *
 * var localConfig = require('./config').localSettings
 */
import baseExtendSettingsDev from './localSettings.dev';
import baseExtendSettingsProd from './localSettings.base';

const baseExtendSettings = process.env.WIKIA_ENVIRONMENT === 'dev' ? baseExtendSettingsDev : baseExtendSettingsProd,
	localSettings = baseExtendSettings({
		// Add custom settings here
		servicesDomain: 'services.wikia-dev.com',
		devboxDomain: 'fallout',
		environment: 'dev',
		loggers: {
			console: 'debug'
		},
	});

export default localSettings;
