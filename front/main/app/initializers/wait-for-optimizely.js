import {getQueryParam} from 'common/utils/querystring';

/**
 * @param {*} application
 *
 * @returns {void}
 */
export function initialize(application) {
	if (!getQueryParam('noexternals')) {
		application.deferReadiness();

		$script.ready(['optimizely'], () => {
			application.advanceReadiness();
		});
	}
}

export default {
	name: 'wait-for-optimizely',
	initialize
};
