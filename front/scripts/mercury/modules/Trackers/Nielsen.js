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
		const nielsen = M.prop('tracking.nielsen');

		if (!nielsen.enabled) {
			return;
		}

		const _nolggGlobalParams = {
			sfcode: 'dcr-cert',
			apid: nielsen.apid,
			apn: 'test-static'
		};
		const staticmeta = {
			clientid: nielsen.clientid,
			subbrand: nielsen.subbrand,
			type: 'static',
			assetid: nielsen.section,
			section: nielsen.section,
			segA: '',
			segB: '',
			segC: ''
		};

		this.appendScript(true, function () {
			let gg1 = NOLCMB.getInstance(_nolggGlobalParams);
			gg1.ggInitialize(_nolggGlobalParams);
			gg1.ggPM('staticstart', staticmeta);
		});
	}
}
