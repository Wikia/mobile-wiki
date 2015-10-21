/// <reference path="./BaseTracker.ts" />
/// <reference path="../../../../vendor/weppy/weppy.d.ts" />
/// <reference path="../../../baseline/mercury/utils/state.ts" />
'use strict';

interface PerfTrackerParams {
	type: string;
	context?: any;
	module?: string;
	name: string;
	value?: number;
	annotations?: any;
}

/**
 * @typedef {object} PerfTrackerParams
 * @property {string} type
 * @property {any} [context]
 * @property {string} [module]
 * @property {string} name
 * @property {number} [value]
 * @property {any} [annotations]
 */

module Mercury.Modules.Trackers {
	export class Perf extends BaseTracker {

		/**
		 * @returns {boolean}
		 */
		public static checkDependencies () {
			return typeof Weppy === 'function';
		}

		tracker: any;
		context: {
			skin: string;
			url?: string;
			'user-agent': string;
			env: string;
			country: string;
		};

		/**
		 * @returns {undefined}
		 */
		constructor () {
			this.tracker = Weppy.namespace('mercury');

			this.context = {
				skin: 'mercury',
				'user-agent': window.navigator.userAgent,
				env: M.prop('environment'),
				url: window.location.href.split('#')[0],
				country: M.prop('geo.country'),
				logged_in: !!M.prop('userId')
			};
			this.tracker.setOptions({
				host: M.prop('weppyConfig').host,
				transport: 'url',
				context: this.context,
				sample: M.prop('weppyConfig').samplingRate,
				aggregationInterval: M.prop('weppyConfig').aggregationInterval
			});
			super();
		}

		/**
		 * @param {PerfTrackerParams} params
		 * @returns {undefined}
		 */
		track (params: PerfTrackerParams): void {
			var trackFn = this.tracker;

			if (typeof params.module === 'string') {
				trackFn = this.tracker.into(params.module);
			}

			// always set the current URL as part of the context
			this.context.url = window.location.href.split('#')[0];

			// update context in Weppy with new URL and any explicitly passed overrides for context
			trackFn.setOptions({
				context: $.extend(params.context, this.context)
			});

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
				case undefined:
					throw 'You failed to specify a tracker type.';
					break;
				default:
					throw 'This action not supported in Weppy tracker';
			}

			trackFn.flush();
		}
	}
}
