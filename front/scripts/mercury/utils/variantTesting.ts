/// <reference path="../../baseline/mercury.d.ts" />

/**
 * @define variantTesting
 *
 * Helper for variant testing using Optimizely
 */
'use strict';

interface Window {
	optimizely?: any;
}

module Mercury.Utils.VariantTesting {
	/**
	 * Activates all variant tests for the current page
	 *
	 * @returns {void}
	 */
	export function activate (): void {
		var optimizely = window.optimizely;
		if (optimizely) {
			optimizely.push(['activate']);
		}
	}

	/**
	 * Tracks an event by name
	 *
	 * @param {string} eventName
	 * @returns {void}
	 */
	export function trackEvent (eventName: string): void {
		var optimizely = window.optimizely;
		if (optimizely) {
			optimizely.push(['trackEvent', eventName]);
		}
	}

	/**
	 * Gets the variation ID given the current Optimizely experiment ID
	 *
	 * @param {string} id
	 * @returns {number}
	 */
	export function getVariation (id: string): number {
		var optimizely = window.optimizely;
		if (optimizely) {
			return optimizely.data.visitor.params['optimizely_x' + id];
		}
		return -1;
	}

	/**
	 * Integrates Optimizely with Universal Analytics
	 *
	 * @param {[]} dimensions
	 * @returns {[]}
	 */
	export function integrateOptimizelyWithUA (dimensions: any[]): any[] {
		var optimizely = window.optimizely,
			experimentId: string,
			dimension: number,
			experimentName: string,
			variationName: string;

		if (optimizely && optimizely.activeExperiments) {
			optimizely.activeExperiments.forEach((experimentId: string): void => {
				if (
					optimizely.allExperiments.hasOwnProperty(experimentId) &&
					typeof optimizely.allExperiments[experimentId].universal_analytics === 'object'
				) {
					dimension = optimizely.allExperiments[experimentId].universal_analytics.slot;
					experimentName = optimizely.allExperiments[experimentId].name;
					variationName = optimizely.variationNamesMap[experimentId];

					dimensions[dimension] = `Optimizely ${experimentName} (${experimentId}): ${variationName}`;
				}
			});
		}

		return dimensions;
	}
}

