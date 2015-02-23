/// <reference path="./BaseTracker.ts" />
'use strict';

interface Window {
	Weppy: any;
}

interface PerfTrackerParams {
	type: string;
	context?: any;
	module?: string;
	name: string;
	value: number;
	annotations?: any;
}

declare var Weppy: any;

module Mercury.Modules.Trackers {
	export class Perf extends BaseTracker {
		tracker: any;

		constructor () {
			this.tracker = Weppy.namespace('mercury');
			this.tracker.setOptions({
				host: Mercury._state.weppyConfig.host,
				transport: 'url',
				context: {
					skin: 'mercury',
					'user-agent': window.navigator.userAgent,
				},
				sample: Mercury._state.weppyConfig.samplingRate,
				aggregationInterval: Mercury._state.weppyConfig.aggregationInterval
			});
			super();
		}

		track (params: PerfTrackerParams): void {
			var trackFn = this.tracker;

			if (params.module && typeof params.module === 'string') {
				trackFn = this.tracker.into(params.module);
			}

			if (params.context) {
				trackFn.setOptions({
					context: params.context
				});
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
				case undefined:
					throw 'You failed to specify a tracker type.'
					break;
				default:
					throw 'This action not supported in Weppy tracker';
			}
		}
	}
}
