/**
 * localSettings for application, used by default by testing environment
 */
import baseLocalSettings = require('./localSettings.base');
import Utils = require('../server/lib/Utils');

var localSettings = baseLocalSettings.getSettings({
	devboxDomain: 'kenneth',
	environment: Utils.Environment.Testing,
	loggers: {
		default: 'info'
	}
});

export = localSettings;
