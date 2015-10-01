/**
 * Default localSettings for application
 *
 * var localConfig = require('./config').localSettings
 */
import Utils = require('../server/lib/Utils');

var baseLocalSettingPath: string = process.env.WIKIA_ENVIRONMENT === 'dev' ? './localSettings.dev' : './localSettings.base',
	baseLocalSettings = require(baseLocalSettingPath),
	localSettings = baseLocalSettings.extendSettings({
		// Add custom settings here
	});

export = localSettings;
