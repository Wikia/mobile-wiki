import * as state from 'state';

/**
 * @typedef {Object} PerfTrackerParams
 * @property {string} type
 * @property {*} [context]
 * @property {string} [module]
 * @property {string} name
 * @property {number} [value]
 * @property {*} [annotations]
 */

const context = {
	country: M.prop('geo.country'),
	env: M.prop('environment'),
	logged_in: Boolean(M.prop('userId')),
	skin: 'mercury',
	url: window.location.href.split('#')[0],
	'user-agent': window.navigator.userAgent
};

let tracker = null,
	initialized = false;

/**
 * @returns {Function|null}
 */
function getTracker() {
	if (initialized === false && typeof Weppy === 'function') {
		tracker = Weppy.namespace('mercury');
		tracker.setOptions({
			aggregationInterval: M.prop('weppyConfig').aggregationInterval,
			context,
			host: M.prop('weppyConfig').host,
			sample: M.prop('weppyConfig').samplingRate,
			transport: 'url'
		});
	}

	initialized = true;

	return tracker;
}

/**
 * @param {PerfTrackerParams} params
 * @returns {void}
 */
export function trackPerf(params) {
	let tracker = getTracker();

	if (typeof params.module === 'string') {
		tracker = tracker.into(params.module);
	}

	// always set the current URL as part of the context
	context.url = window.location.href.split('#')[0];

	// update context in Weppy with new URL and any explicitly passed overrides for context
	tracker.setOptions({
		context: $.extend(params.context, context)
	});

	if (typeof params.type === 'undefined') {
		throw new Error('You failed to specify a tracker type.');
	}

	switch (params.type) {
	case 'count':
		tracker.count(params.name, params.value, params.annotations);
		break;
	case 'store':
		tracker.store(params.name, params.value, params.annotations);
		break;
	case 'timer':
		tracker.timer.send(params.name, params.value, params.annotations);
		break;
	case 'mark':
		tracker.timer.mark(params.name, params.annotations);
		break;
	default:
		throw new Error('This action not supported in Weppy tracker');
	}

	tracker.flush();
}

/**
 * @returns {void}
 */
export function sendPagePerformance() {
	tracker.sendPagePerformance();
	// used for automation test
	state.prop('pagePerformanceSent', true);
}
