/**
 * @param {string} name
 * @returns {string}
 */
export function getQueryParam(name) {
	const nameSanitized = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]'),
		regex = new RegExp(`[\\?&]${nameSanitized}=([^&#]*)`),
		results = regex.exec(location.search);

	return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}
