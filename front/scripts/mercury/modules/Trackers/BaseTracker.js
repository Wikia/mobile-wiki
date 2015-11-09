/**
 * Base class for trackers that have to append their scripts like Comscore or Quantserve
 */
export class BaseTracker {
	constructor() {
		this.script = document.getElementsByTagName('script')[0];
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

		this.script.parentNode.insertBefore(elem, this.script);
	}
}
