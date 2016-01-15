/**
 * Base class for trackers that have to append their scripts like Comscore or Quantserve
 *
 * @class BaseTracker
 *
 * @property {HTMLScriptElement} script
 * @property {boolean} usesAdsContext
 */
class BaseTracker {
	constructor() {
		this.usesAdsContext = false;
	}

	/**
	 * This method should overridden implemented by a tracker
	 *
	 * @returns {string}
	 */
	url() {
		return '';
	}

	/**
	 *
	 * @param {boolean} synchronousCall
	 * @param {function} onLoad
	 *
	 * @returns {void}
	 */
	appendScript(synchronousCall = false, onLoad = null) {
		const elem = document.createElement('script');

		elem.async = !synchronousCall;
		elem.src = this.url();
		if (typeof onLoad === 'function') {
			elem.onload = onLoad;
		}

		BaseTracker.script.parentNode.insertBefore(elem, BaseTracker.script);
	}
}

BaseTracker.script = document.getElementsByTagName('script')[0];

export default BaseTracker;
