/**
 * Default localSettings for application
 */
var baseLocalSettings = require('./localsettings.base'),
	localSettings = baseLocalSettings.extendSettings({
		port: 8111
	});

exports.localSettings = localSettings;
