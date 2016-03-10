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

		$script.ready(['optimizely'], () => {
			application.advanceReadiness();
		});
	}
}

export default {
	name: 'wait-for-optimizely',
	initialize
};
