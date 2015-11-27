/**
 * @class UrlHelper
 */
export default class UrlHelper {
	/**
	 * @param {Object} object
	 * @returns {string}
	 */
	urlEncode(object) {

		/**
		 * @param {string} key
		 * @returns {string}
		 */
		return Object.keys(object).map((key) =>
				`${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`
		).join('&');
	}

	/**
	 * @param {string} input
	 * @returns {object}
	 */
	urlDecode(input) {
		const queryDict = {};

		/**
		 * @param {string} item
		 * @returns {void}
		 */
		input.split('&').forEach((item) => {
			queryDict[decodeURIComponent(item.split('=')[0])] = decodeURIComponent(item.split('=')[1]);
		});
		return queryDict;
	}
}
