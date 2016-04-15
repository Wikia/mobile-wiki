import Ember from 'ember';
import {sendPagePerformance, trackPerf} from 'common/utils/track-perf';

/**
 * @returns {void}
 */
export function initialize() {
	const firstRenderTime = M.prop('firstRenderTime');

	// Send page performance stats after window is loaded
	// Since we load our JS async this code may execute post load event
	if (document.readyState === 'complete') {
		sendPagePerformance();
	} else {
		Ember.$(window).on('load', sendPagePerformance);
	}

	if (!Ember.isEmpty(firstRenderTime)) {
		trackPerf({
			type: 'timer',
			name: 'firstRender',
			value: firstRenderTime
		});
	}
}

export default {
	name: 'performance-monitoring',
	initialize
};
