/**
 * Default localSettings for application
 */

var baseLocalSettings = require('./localsettings.base'),
	localSettings = baseLocalSettings.getSettings({
	// Add custom settings here
});

exports.localSettings = localSettings;
