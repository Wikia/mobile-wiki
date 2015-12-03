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
		devboxDomain: 'rwilinski',
		loggers: {
			default: 'debug'
		},
		port: 7000
	});

export = localSettings;
