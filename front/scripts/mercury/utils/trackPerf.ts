/// <reference path="../../baseline/mercury.d.ts" />
/// <reference path="../modules/Trackers/Perf.ts" />
'use strict';

/**
* @description Instantiates performance tracker
*/
module Mercury.Utils {
	var instance: Mercury.Modules.Trackers.Perf;
	export function trackPerf (obj: PerfTrackerParams) {
		if (Mercury.Modules.Trackers.Perf.depsLoaded) {
			instance = instance || new Mercury.Modules.Trackers.Perf();
			instance.track(obj);
		}
	}
}
