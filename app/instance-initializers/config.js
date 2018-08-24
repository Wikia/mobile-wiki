import initializeConfig from '@wikia/ember-fandom/instance-initializers/config';
import config from '../config/environment';

export function initialize(applicationInstance) {
	initializeConfig(applicationInstance, config);
}

export default {
	name: 'config',
	initialize
};
