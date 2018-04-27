const trackingRouteName = 'special/adengplayerinfo';

export default {
	/**
	 * Checks whether tracker is enabled via instant global
	 * @returns {boolean}
	 */
	isEnabled() {
		// Global imports:
		const context = window.Wikia.adEngine.context;
		// End of imports

		return context.get('options.tracking.kikimora.player');
	},

	/**
	 * Porvata event callback
	 * @param {string} eventName
	 * @param {Object} playerParams
	 * @param {Object} data
	 * @returns {void}
	 */
	onEvent(eventName, playerParams, data) {
		// Global imports:
		const context = window.Wikia.adEngine.context;
		const geo = window.Wikia.adProductsGeo;
		const slotService = window.Wikia.adEngine.slotService;
		// End of imports

		const slot = slotService.getBySlotName(data.position);
		const trackingData = Object.assign(data, {
			pv_unique_id: window.pvUID,
			pv_number: window.pvNumber,
			country: geo.getCountryCode(),
			skin: context.get('targeting.skin'),
			wsi: slot.getTargeting().wsi || '',
		});

		M.tracker.Internal.track(trackingRouteName, trackingData);
	},
};
