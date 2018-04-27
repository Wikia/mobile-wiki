const trackingRouteName = 'special/adengplayerinfo';

/**
 * Prepare data for tracking
 * @param {Object} data
 * @param {string} playerName
 * @param {string} eventName
 * @param {int} errorCode
 * @returns {Object}
 */
function prepareData(data, playerName, eventName, errorCode = 0) {
	// Global imports:
	const adEngine = window.Wikia.adEngine;
	const geo = window.Wikia.adProductsGeo;
	const context = adEngine.context;
	const slotService = adEngine.slotService;
	const utils = adEngine.utils;
	// End of imports

	const slot = slotService.getBySlotName(data.slotName);

	return {
		pv_unique_id: window.pvUID,
		pv_number: window.pvNumber,
		country: geo.getCountryCode(),
		skin: context.get('targeting.skin'),
		wsi: slot.getTargeting().wsi || '',
		player: playerName,
		ad_product: data.adProduct,
		position: data.slotName || '',
		event_name: eventName,
		ad_error_code: errorCode,
		content_type: data.contentType,
		line_item_id: data.lineItemId || '',
		creative_id: data.creativeId || '',
		timestamp: new Date().getTime(),
		price: '',
		browser: `${utils.client.getOperatingSystem()} ${utils.client.getBrowser()}`,
		audio: data.withAudio ? 1 : 0,
	};
}

/**
 * Wrapper for player data warehouse tracking
 */
export default class PlayerTracker {
	/**
	 * Track single event
	 * @param {Object} data
	 * @param {string} playerName
	 * @param {string} eventName
	 * @param {int} errorCode
	 * @returns {void}
	 */
	static track(data, playerName, eventName, errorCode) {
		if (!window.Wikia.adEngine || !window.Wikia.adProductsGeo || !data.adProduct || !playerName || !eventName) {
			return;
		}

		// Global imports:
		const context = awindow.Wikia.adEngine.context;
		// End of imports

		if (context.get('options.tracking.kikimora.player')) {
			const trackingData = prepareData(data, playerName, eventName, errorCode);

			M.tracker.Internal.track(trackingRouteName, trackingData);
		}
	}
}
