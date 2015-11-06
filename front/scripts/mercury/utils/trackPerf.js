/// <reference path="../../baseline/mercury.d.ts" />
/// <reference path="../modules/Trackers/Perf.ts" />
'use strict';

/**
 * Instantiates performance tracker
 */
module Mercury.Utils {
	var instance: Mercury.Modules.Trackers.Perf;

	/**
	 * @returns {Mercury.Modules.Trackers.Perf}
	 */
	function getInstance(): typeof instance {
		if (Mercury.Modules.Trackers.Perf.checkDependencies()) {
			instance = instance || new Mercury.Modules.Trackers.Perf();
			return instance;
		}
		throw new Error('no instance found');
	}

	/**
	 * @param {PerfTrackerParams} obj
	 * @returns {void}
	 */
	export function trackPerf(obj: PerfTrackerParams): void {
		return getInstance().track(obj);
	}

	/**
	 * @returns {void}
	 */
	export function sendPagePerformance(): void {
		// Initializes Weppy context
		getInstance();
		Weppy.sendPagePerformance();
		// used for automation test
		M.prop('pagePerformanceSent', true);
	}
}
