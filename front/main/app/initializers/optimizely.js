import Ember from 'ember';
import {getQueryParam} from 'common/utils/querystring';

/**
 * @param {*} container
 * @param {*} application
 *
 * @returns {void}
 */
export function initialize(container, application) {
	const optimizelyScript = M.prop('optimizelyScript');

	if (!Ember.isEmpty(optimizelyScript) && !getQueryParam('noexternals')) {
		application.deferReadiness();

		Ember.$.getScript(optimizelyScript).always(() => {
			application.advanceReadiness();
		});
	}
}

export default {
	name: 'optimizely',
	initialize
};
