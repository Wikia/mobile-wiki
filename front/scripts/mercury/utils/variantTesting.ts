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

interface OptimizelyExperimentIds {
	prod: string;
	dev: string;
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

	/**
	 * Get list of Optimizely active experiments
	 *
	 * @returns {[]}
	 */
	export function getOptimizelyActiveExperimentsList (): string[] {
		var optimizely = window.optimizely;

		return optimizely ? optimizely.activeExperiments : null;
	}

	/**
	 * Get Optimizely variation numbers for given experiment ID
	 *
	 * @param {string} experimentId
	 * @returns {[]}
	 */
	export function getOptimizelyExperimentVariationNumber (experimentId: string): number {
		var optimizely = window.optimizely;

		return (optimizely && optimizely.variationMap) ? optimizely.variationMap[experimentId] : null;
	}

	/**
	 * Get Optimizely experiment ID based on environment the app is running on
	 *
	 * @param {object} experimentIds contains experimentIdProd and experimentIdDev
	 * @returns {string} experimentId
	 */
	export function getOptimizelyExperimentIdForThisEnvironment (experimentIds: OptimizelyExperimentIds): string {
		var environment = M.prop('environment');

		switch (environment) {
			case 'prod':
				return experimentIds.prod;
			case 'dev':
				return experimentIds.dev;
			default:
				return null;
		}
	}
}

