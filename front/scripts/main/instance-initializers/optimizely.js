import {getQueryParam} from '../../mercury/utils/queryString';

export function initialize(applicationInstance) {
	const optimizelyScript = M.prop('optimizelyScript');

	if (!Ember.isEmpty(optimizelyScript) && !getQueryParam('noexternals')) {
		//applicationInstance.deferReadiness();

		//Ember.$.getScript(optimizelyScript).always(() => {
		//	applicationInstance.advanceReadiness();
		//});
	}
}

export default {
	name: 'optimizely',
	initialize
};
