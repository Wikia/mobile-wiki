import applicationInstance from '../utils/application-instance';

export function initialize(appInstance) {
	applicationInstance.instance = appInstance;
}

export default {
	name: 'application-instance',
	initialize
};
