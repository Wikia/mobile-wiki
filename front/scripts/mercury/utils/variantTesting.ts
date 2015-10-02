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
	 * Checks if Optimizely object and its crucial data attributes are available
	 *
	 * @returns {boolean}
	 */
	export function isOptimizelyLoadedAndActive() {
		var optimizely = window.optimizely;

		return optimizely &&
			optimizely.activeExperiments &&
			Array.isArray(optimizely.activeExperiments) &&
			optimizely.activeExperiments.length > 0 &&
			typeof optimizely.allExperiments === 'object' &&
			Object.keys(optimizely.allExperiments).length > 0 &&
			typeof optimizely.variationNamesMap === 'object' &&
			Object.keys(optimizely.variationNamesMap).length > 0;
	}

	/**
	 * Integrates Optimizely with Universal Analytics
	 *
	 * @param {[]} dimensions
	 * @returns {[]}
	 */
	export function integrateOptimizelyWithUA (dimensions: any[]): any[] {
		var optimizely = window.optimizely,
			activeExperiments = this.getActiveExperimentsList(),
			dimension: number,
			experimentName: string,
			variationName: string;

		// UA integration code is also used in MediaWiki app - if you change it here, change it there too:
		// isOptimizelyLoadedAndActive function and below
		// https://github.com/Wikia/app/blob/dev/extensions/wikia/AnalyticsEngine/js/universal_analytics.js
		if (activeExperiments) {
			activeExperiments.forEach((experimentId: string): void => {
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
	export function getActiveExperimentsList (): string[] {
		return isOptimizelyLoadedAndActive() ? window.optimizely.activeExperiments : null;
	}

	/**
	 * Get number of the Optimizely experiment variation the user is running for given experiment ID
	 *
	 * @param {string} experimentId
	 * @returns {number}
	 */
	export function getExperimentVariationNumberBySingleId (experimentId: string): number {
		var optimizely = window.optimizely;

		return (isOptimizelyLoadedAndActive() && typeof optimizely.variationMap[experimentId] === 'number') ?
			optimizely.variationMap[experimentId] : null;
	}

	/**
	 * Get Optimizely experiment ID based on environment the app is running on
	 *
	 * @param {object} experimentIds contains experimentIdProd and experimentIdDev
	 * @returns {string} experimentId
	 */
	export function getExperimentIdForThisEnvironment (experimentIds: OptimizelyExperimentIds): string {
		var environment = M.prop('environment');

		switch (environment) {
			case 'prod':
			case 'preview':
			case 'sandbox':
				return experimentIds.prod;
			case 'dev':
				return experimentIds.dev;
			default:
				return null;
		}
	}

	/**
	 * Get Optimizely variation number for given experiment ID based on environment the app is running on
	 *
	 * @param {OptimizelyExperimentIds} experimentIds
	 * @returns {number}
	 */
	export function getExperimentVariationNumber (experimentIds: OptimizelyExperimentIds): number {
		var experimentIdForThisEnv = this.getExperimentIdForThisEnvironment(experimentIds),
			activeExperimentsList = this.getActiveExperimentsList();

		if (activeExperimentsList && activeExperimentsList.indexOf(experimentIdForThisEnv) !== -1) {
			return this.getExperimentVariationNumberBySingleId(experimentIdForThisEnv);
		}

		return null;
	}
}
