/* eslint no-new: 0 */

let cachedData = {};

/**
 * @returns {void}
 */
export function loadGlobalData() {
	return $.get('/globals', (data) => cachedData = data);
}

/**
 * @returns {string|null}
 */
export function getLoginUrl() {
	return cachedData ? cachedData.loginUrl : null;
}

/**
 * @returns {number}
 */
export function getMobileBreakpoint() {
	return cachedData ? cachedData.mobileBreakpoint : 710;
}

/**
 * @returns {number}
 */
export function getOptimizelyId() {
	return cachedData ? cachedData.googleSearchOptimizelyId : 0;
}

/**
 * @returns {string|null}
 */
export function getJaCommunityUrl() {
	return cachedData ? cachedData.jaCommunityUrl : null;
}

/**
 * @returns {string|null}
 */
export function getJaUniversityUrl() {
	return cachedData ? cachedData.jaUniversityUrl : null;
}

/**
 * @returns {string|null}
 */
export function getStartWikiaUrl() {
	return cachedData ? cachedData.startWikiaUrl : null;
}

