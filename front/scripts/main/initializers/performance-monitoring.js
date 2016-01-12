import * as trackPerf from '../../mercury/utils/trackPerf';

/**
 * @returns {void}
 */
export function initialize() {
	if (typeof EmPerfSender === 'undefined') {
		return;
	}

	// Send page performance stats after window is loaded
	// Since we load our JS async this code may execute post load event
	if (document.readyState === 'complete') {
		trackPerf.sendPagePerformance();
	} else {
		$(window).load(() => trackPerf.sendPagePerformance());
	}

	EmPerfSender.initialize({
		enableLogging: (M.prop('environment') === 'dev'),

		// Specify a specific function for EmPerfSender to use when it has captured metrics
		send(events, metrics) {
			// This is where we connect EmPerfSender with our persistent metrics adapter, in this case, trackPerf
			// is our instance of a Weppy interface
			trackPerf.trackPerf({
				module: metrics.klass.split('.')[0].toLowerCase(),
				name: metrics.klass,
				type: 'timer',
				value: metrics.duration
			});
		}
	});
}

export default {
	name: 'performance-monitoring',
	initialize
};
