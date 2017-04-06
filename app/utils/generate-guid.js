/**
 * create unique string with prefix as a base of the string if passed
 *
 * @param {string} [prefix='']
 * @returns {string} unique string
 */
export default function generateGuid(prefix = '') {
	return `${prefix}${Date.now()}`;
}
