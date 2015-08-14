/**
 * Default localSettings for application
 */

var baseLocalSettings = require('./localSettings.base'),
	localSettings = baseLocalSettings.getSettings({
	// Add custom settings here
});

exports.localSettings = localSettings;
