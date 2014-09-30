/**
 * localSettings for application, used by default by travis
 * (settings in .travis.yml)
 */
import baseLocalSettings = require('./localSettings.base');

var localSettings = baseLocalSettings.getSettings({
	mediawikiHost: 'kenneth',
	loggers: {}
});

export = localSettings;
