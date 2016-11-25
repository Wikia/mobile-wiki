import baseSettings from './settings.base';
import deepExtend from 'deep-extend';
import Logger from '../app/lib/logger';

let environmentSettings;

try {
	environmentSettings = require(`./settings.${process.env.WIKIA_ENVIRONMENT}`)
} catch( exception ) {
	Logger.debug({
		message: exception.message,
	}, 'Could not load settings, falling back to base settings');

	environmentSettings = {};
}

export default deepExtend(baseSettings, environmentSettings, {
	// Add custom settings here
});
