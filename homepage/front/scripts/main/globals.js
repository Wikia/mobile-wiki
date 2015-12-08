/* eslint no-new: 0 */

let cachedData = {};

/**
 * @returns {void}
 */
export function loadGlobalData() {
	new RSVP.Promise((resolve) => {
		$.get('/globals', (data) => resolve(data)).then((data) => cachedData = data);
	});
}

/**
 * @returns {string|null}
 */
export function getLoginUrl() {
	return cachedData ? cachedData.loginUrl : null;
}
