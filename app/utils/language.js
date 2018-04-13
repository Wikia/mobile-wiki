export const langPathRegexp = '(/[a-z]{2,3}(?:-[a-z-]{2,12})?)';

/**
 * @param {Object} request - FastBoot request
 * @returns {string|null}
 */
export default function getLanguageCodeFromRequest(request = null) {
	const path = request ? request.get('path') : window.location.pathname,
		matches = path.match(new RegExp(`^${langPathRegexp}/`));

	return matches && matches[1];
}
