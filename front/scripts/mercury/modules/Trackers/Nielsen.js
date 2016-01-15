import BaseTracker from './BaseTracker';

/**
 * @class Nielsen
 */
export default class Nielsen extends BaseTracker {
	/**
	 * @returns {string}
	 */
	url() {
		return 'http://secure-dcr-cert.imrworldwide.com/novms/js/2/ggcmb500.js';
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
			},
			staticmeta = {
				clientid: nielsen.clientid,
				subbrand: nielsen.subbrand,
				type: 'static',
				assetid: nielsen.section,
				section: nielsen.section,
				segA: '',
				segB: '',
				segC: ''
			};

		if (!nielsen.enabled) {
			return;
		}

		this.appendScript(true, () => {
			if (!window.NOLCMB || !window.NOLCMB.getInstance) {
				return;
			}

			const gg = window.NOLCMB.getInstance(globalParams);

			gg.ggInitialize(globalParams);
			gg.ggPM('staticstart', staticmeta);
		});
	}
}
