import {isEmpty} from '@ember/utils';
import $ from 'jquery';
import {sendPagePerformance, trackPerf} from '../utils/track-perf';

/**
 * @returns {void}
 */
export function initialize() {
	if (typeof FastBoot !== 'undefined') {
		return;
	}

	const firstRenderTime = window.firstRenderTime;

	// Send page performance stats after window is loaded
	// Since we load our JS async this code may execute post load event
	if (document.readyState === 'complete') {
		sendPagePerformance();
	} else {
		$(window).on('load', sendPagePerformance);
	}

	if (!isEmpty(firstRenderTime)) {
		trackPerf({
			type: 'timer',
			name: 'firstRender',
			value: firstRenderTime
		});
	}

}

export default {
	after: 'config',
	name: 'performance-monitoring',
	initialize
};
