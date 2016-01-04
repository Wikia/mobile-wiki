/* eslint no-new: 0 */

let cachedData = {};

/**
 * @returns {void}
 */
export function loadGlobalData() {
	$.get('/globals', (data) => cachedData = data);
}

/**
 * @returns {string|null}
 */
export function getLoginUrl() {
	return cachedData ? cachedData.loginUrl : null;
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
