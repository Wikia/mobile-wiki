import {getQueryParam} from 'common/utils/queryString';

/**
 * @param {*} container
 * @param {*} application
 *
 * @returns {void}
 */
export function initialize(container, application) {
	if (!getQueryParam('noexternals')) {
		application.deferReadiness();

		$script.ready(['optimizely', 'ua'], () => {
			application.advanceReadiness();
		});
	}
}

export default {
	name: 'wait-for-tracking',
	initialize
};
