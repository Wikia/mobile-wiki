/**
 * Helper for variant testing using Optimizely
 */
import M from '../mmm';

/**
 * @typedef {Object} OptimizelyExperimentIds
 * @property {string} prod
 * @property {string} dev
 */

/**
 * Activates all variant tests for the current page
 *
 * @returns {void}
 */
export function activate() {
	const optimizely = window.optimizely;

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
export function trackEvent(eventName) {
	const optimizely = window.optimizely;

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
	const optimizely = window.optimizely;

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
 * Get list of Optimizely active experiments
 *
 * @returns {string[]}
 */
export function getActiveExperimentsList() {
	return isOptimizelyLoadedAndActive() ? window.optimizely.activeExperiments : null;
}

/**
 * Get number of the Optimizely experiment variation the user is running for given experiment ID
 *
 * @param {string} experimentId
 * @returns {number|null}
 */
export function getExperimentVariationNumberBySingleId(experimentId) {
	const optimizely = window.optimizely;

	return (isOptimizelyLoadedAndActive() && typeof optimizely.variationMap[experimentId] === 'number') ?
		optimizely.variationMap[experimentId] : null;
}

/**
 * Get Optimizely experiment ID based on environment the app is running on
 *
 * @param {OptimizelyExperimentIds} experimentIds - contains experimentIdProd and experimentIdDev
 * @returns {string|null}
 */
export function getExperimentIdForThisEnvironment(experimentIds) {
	const environment = M.prop('environment');

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
 * @returns {number|null}
 */
export function getExperimentVariationNumber(experimentIds) {
	const experimentIdForThisEnv = getExperimentIdForThisEnvironment(experimentIds),
		activeExperimentsList = getActiveExperimentsList();

	if (activeExperimentsList && activeExperimentsList.indexOf(experimentIdForThisEnv) !== -1) {
		return getExperimentVariationNumberBySingleId(experimentIdForThisEnv);
	}

	return null;
}
