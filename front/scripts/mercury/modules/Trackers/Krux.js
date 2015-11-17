
/**
 * @typedef {Object} KruxModule
 * @property {Function} [load]
 */

/**
 * @class Krux
 *
 * @property {KruxModule} kruxModule
 */
export default class Krux {
	/**
	 * @param {KruxModule} krux
	 * @returns {void}
	 */
	constructor(krux) {
		this.kruxModule = krux || {};
	}

	/**
	 * Exports page params to Krux.
	 *
	 * mobileId variable is the ID referencing to the mobile site
	 * (see ads_run.js and krux.js in app repository)
	 *
	 * @returns {void}
	 */
	trackPageView() {
		if (typeof this.kruxModule.load === 'function') {
			this.kruxModule.load(M.prop('tracking.krux.mobileId'));
		}
	}
}
