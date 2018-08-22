import config from '../config/environment';
import initializeConfig from '@wikia/ember-fandom/instance-initializers/config';

export function initialize(applicationInstance) {
	initializeConfig(applicationInstance, config);
}

export default {
	name: 'config',
	initialize
};
