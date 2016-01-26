/**
 * @class InstantGlobals
 */
export default class InstantGlobals {
	/**
	 * @param {string} key
	 *
	 * @returns {*}
	 */
	static get(key) {
		if (window.Wikia && window.Wikia.InstantGlobals) {
			return window.Wikia.InstantGlobals[key];
		}
	}
}
