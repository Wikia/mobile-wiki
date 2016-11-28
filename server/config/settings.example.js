import baseSettings from './settings.base';
import deepExtend from 'deep-extend';

let environmentSettings;

try {
	environmentSettings = require(`./settings.${process.env.WIKIA_ENVIRONMENT}.js`).default;
} catch (exception) {
	environmentSettings = {};
}

export default deepExtend(baseSettings, environmentSettings, {
	// Add custom settings here
});
