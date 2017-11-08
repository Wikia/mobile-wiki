import {isArray} from '@ember/array';

/**
 * @param {string} url
 * @returns {string|null}
 */
export default function extractDomainFromUrl(url) {
	const domain = (
		/^(?:https?:\/\/)?((?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])(?:[/?#]|$)/i
	).exec(url);

	return isArray(domain) ? domain[1] : null;
}
