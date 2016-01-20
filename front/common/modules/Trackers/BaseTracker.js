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
	 * @returns {void}
	 */
	appendScript() {
		const elem = document.createElement('script');

		elem.async = true;
		elem.src = this.url();

		BaseTracker.script.parentNode.insertBefore(elem, BaseTracker.script);
	}
}

BaseTracker.script = document.getElementsByTagName('script')[0];

export default BaseTracker;
