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

module Mercury.Modules.Trackers {
	export class Perf extends BaseTracker {

		public static checkDependencies () {
			return typeof Weppy === 'function';
		}

		tracker: any;
		defaultContext: {
			skin: string;
			url?: string;
			'user-agent': string;
			env: string;
		};

		constructor () {
			this.tracker = Weppy.namespace('mercury');
			this.defaultContext = {
				skin: 'mercury',
				'user-agent': window.navigator.userAgent,
				env: M.prop('environment'),
				url: window.location.href.split('#')[0]
			};
			this.tracker.setOptions({
				host: M.prop('weppyConfig').host,
				transport: 'url',
				context: this.defaultContext,
				sample: M.prop('weppyConfig').samplingRate,
				aggregationInterval: M.prop('weppyConfig').aggregationInterval
			});
			super();
		}

		track (params: PerfTrackerParams): void {
			var trackFn = this.tracker;

			if (typeof params.module === 'string') {
				trackFn = this.tracker.into(params.module);
			}

			// always set the current URL as part of the context
			this.defaultContext.url = window.location.href.split('#')[0];

			// update context in Weppy with new URL and any explicitly passed overrides for context
			trackFn.setOptions({
				context: $.extend(params.context, this.defaultContext)
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
