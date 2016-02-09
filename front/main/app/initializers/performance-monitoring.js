import Ember from 'ember';
import {sendPagePerformance} from 'common/utils/trackPerf';

/**
 * @returns {void}
 */
export function initialize() {
	// Send page performance stats after window is loaded
	// Since we load our JS async this code may execute post load event
	if (document.readyState === 'complete') {
		sendPagePerformance();
	} else {
		Ember.$(window).on('load', sendPagePerformance);
	}
}

export default {
	name: 'performance-monitoring',
	initialize
};
