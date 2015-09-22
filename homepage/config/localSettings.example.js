/**
 * Default localSettings for application
 */

var baseLocalSettings = require('./localSettings.base'),
	localSettings = baseLocalSettings.extendSettings({
		// Add custom settings here
	});

exports.localSettings = localSettings;
