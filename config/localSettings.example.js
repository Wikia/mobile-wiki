/**
 * Default localSettings for application
 *
 * var localConfig = require('./config').localSettings
 */
const baseLocalSettingPath = process.env.WIKIA_ENVIRONMENT === 'dev' ? './localSettings.dev' : './localSettings.base',
	baseLocalSettings = require(baseLocalSettingPath),
	localSettings = baseLocalSettings.extendSettings({
		// Add custom settings here
	});

exports.localSettings = localSettings;
