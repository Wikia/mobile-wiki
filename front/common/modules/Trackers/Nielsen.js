import BaseTracker from './BaseTracker';

/**
 * @class Nielsen
 */
export default class Nielsen extends BaseTracker {
	/**
	 * @returns {string}
	 */
	url() {
		return `http://secure-dcr-cert.imrworldwide.com/novms/js/2/ggcmb500.js?${Date.now()}`;
	}

	/**
	 * @returns {void}
	 */
	trackPageView() {
		const nielsen = M.prop('tracking.nielsen'),
			globalParams = {
				sfcode: 'dcr-cert',
				apid: nielsen.apid,
				apn: 'test-static'
			};

		if (!nielsen.enabled) {
			return;
		}

		delete window.NOLCMB;
		this.appendScript(true, () => {
			if (!window.NOLCMB || !window.NOLCMB.getInstance) {
				return;
			}

			window.gg1 = window.NOLCMB.getInstance(globalParams);
			window.staticmeta = {
				type: 'static',
				assetid: nielsen.section,
				section: nielsen.section,
				segA: nielsen.dbName,
				segB: '',
				segC: ''
			};

			window.gg1.ggInitialize(globalParams);
			window.gg1.ggPM('staticstart', window.staticmeta);
		});
	}
}
