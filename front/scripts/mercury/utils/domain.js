/**
 * @param {string} [hostname=window.location.hostname]
 * @returns {string}
 */
export function getDomain(hostname = window.location.hostname) {
	const domain = (/[^.]+\.[^.]+$/).exec(hostname);

	return Em.isArray(domain) ? domain[0] : hostname;
}
