import devLocalSettings = require('./localSettings.dev');
import Utils = require('../server/lib/Utils');
var localSettings = devLocalSettings.extendSettings({
	loggers: {
		console: 'error'
	},
	devboxDomain: 'bkowalczyk',
	wikiFallback: 'glee',
	newLoginEnabled: false,
	port: 7000,
	ironSecret: '96f88bbd2acbd05b02fd751c5e8c0da8a73e8ab3',
	enableNewSignup: true,
	facebook: {
		appId: 881967318489580
	},
	servicesDomain: 'services.wikia-dev.com'
});
export = localSettings;
