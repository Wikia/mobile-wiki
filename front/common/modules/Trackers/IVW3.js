import BaseTracker from './BaseTracker';
import InstantGlobals from '../InstantGlobals';

/**
 * @class IVW3
 */
export default class IVW3 extends BaseTracker {
	constructor() {
		super();
		this.initialized = Boolean(window.iom);
	}

	/**
	 * @returns {string}
	 */
	url() {
		return 'https://script.ioam.de/iam.js';
	}

	/**
	 * @param {object} ivw3
	 * @returns {void}
	 */
	static sendRequest(ivw3) {
		if (!window.iom) {
			return;
		}
		const iamData = {
			st: 'wikia',
			cp: ivw3.vertical,
			sv: 'ke'
		};

		window.iom.c(iamData, 2);
	}

	/**
	 * @returns {void}
	 */
	trackPageView() {
		const country = M.prop('geo.country'),
			ivw3 = M.prop('tracking.ivw3');

		if (!InstantGlobals.get('wgSitewideDisableIVW3') &&
			typeof ivw3.countries.indexOf === 'function' &&
			ivw3.countries.indexOf(country) !== -1
		) {
			if (this.initialized) {
				IVW3.sendRequest(ivw3);
			} else {
				this.appendScript(true, () => {
					IVW3.sendRequest(ivw3);
				});
			}
		}
	}
}
