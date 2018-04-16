export const langPathRegexp = '(/[a-z]{2,3}(?:-[a-z-]{2,12})?)';

/**
 * @param {string} path
 * @returns {string|null}
 */
export default function getLanguageCodeFromRequest(path) {
	const matches = path.match(new RegExp(`^${langPathRegexp}/`));

	return matches && matches[1];
}
