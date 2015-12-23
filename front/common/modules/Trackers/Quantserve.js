import BaseTracker from './BaseTracker';

/**
 * @class Quantserve
 */
export default class Quantserve extends BaseTracker {
	/**
	 * @returns {void}
	 */
	constructor() {
		window._qevents = [];
		super();
		this.usesAdsContext = true;
	}

	/**
	 * @returns {string}
	 */
	url() {
		const prefix = (document.location.protocol === 'https:' ? 'https://secure' : 'http://edge');

		return `${prefix}.quantserve.com/quant.js?${Math.random()}`;
	}

	/**
	 * @returns {void}
	 */
	trackPageView() {
		const quantcastLabels = ['Category.MobileWeb.Mercury'];

		if (Mercury.wiki.vertical) {
			quantcastLabels.unshift(Mercury.wiki.vertical);
		}

		// without this quantserve does not want to track 2+ page view
		window.__qc = null;

		window._qevents = [{
			qacct: M.prop('tracking.quantserve'),
			labels: quantcastLabels.join(',')
		}];

		this.appendScript();
	}
}
