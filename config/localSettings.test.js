/**
 * localSettings for application, used by default by testing environment
 */
const baseLocalSettings = require('./localSettings.base'),
	Utils = require('../server/lib/Utils'),

	localSettings = baseLocalSettings.extendSettings({
		devboxDomain: 'kenneth',
		environment: Utils.Environment.Testing,
		loggers: {
			default: 'info'
		}
	});

exports.localSettings = localSettings;
