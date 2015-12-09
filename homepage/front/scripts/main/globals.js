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
