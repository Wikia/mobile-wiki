import {globalProp} from '../../baseline/mercury/utils/state';

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
		country: globalProp('geo.country'),
		env: globalProp('environment'),
		logged_in: Boolean(globalProp('userId')),
		skin: 'mercury',
		url: window.location.href.split('#')[0],
		'user-agent': window.navigator.userAgent
	},
	tracker = (typeof Weppy === 'function') ?
		Weppy.namespace('mercury').setOptions({
			aggregationInterval: globalProp('weppyConfig').aggregationInterval,
			context,
			host: globalProp('weppyConfig').host,
			sample: globalProp('weppyConfig').samplingRate,
			transport: 'url'
		}) :
		null;

/**
 * @param {PerfTrackerParams} params
 * @returns {void}
 */
export function trackPerf(params) {
	let trackFn = tracker;

	if (typeof params.module === 'string') {
		trackFn = tracker.into(params.module);
	}

	// always set the current URL as part of the context
	context.url = window.location.href.split('#')[0];

	// update context in Weppy with new URL and any explicitly passed overrides for context
	trackFn.setOptions({
		context: $.extend(params.context, context)
	});

	if (typeof params.type === 'undefined') {
		throw new Error('You failed to specify a tracker type.');
	}

	switch (params.type) {
	case 'count':
		trackFn.count(params.name, params.value, params.annotations);
		break;
	case 'store':
		trackFn.store(params.name, params.value, params.annotations);
		break;
	case 'timer':
		trackFn.timer.send(params.name, params.value, params.annotations);
		break;
	case 'mark':
		trackFn.timer.mark(params.name, params.annotations);
		break;
	default:
		throw new Error('This action not supported in Weppy tracker');
	}

	trackFn.flush();
}

/**
 * @returns {void}
 */
export function sendPagePerformance() {
	tracker.sendPagePerformance();
	// used for automation test
	globalProp('pagePerformanceSent', true);
}
