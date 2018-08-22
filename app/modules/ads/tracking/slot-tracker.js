const trackingRouteName = 'special/adengadinfo';

const onChangeStatusToTrack = [
	'blocked',
	'error',
	'viewport-conflict',
	'sticked',
	'unsticked',
];

function getPosParameter({ pos = '' }) {
	return (Array.isArray(pos) ? pos : pos.split(','))[0].toLowerCase();
}

function checkOptIn() {
	let geoRequires = true;

	if (window.M === 'undefined') {
		geoRequires = true;
	} else if (typeof window.M.geoRequiresConsent !== 'undefined') {
		geoRequires = window.M.geoRequiresConsent;
	} else if (typeof window.M.continent !== 'undefined') {
		geoRequires = window.M.continent === 'EU';
	}

	if (geoRequires) {
		const { context } = window.Wikia.adEngine;

		return context.get('options.trackingOptIn') ? 'yes' : 'no';
	}

	return '';
}

/**
 * Prepare data for render ended tracking
 * @param {Object} slot
 * @param {Object} data
 * @returns {Object}
 */
function prepareData(slot, data) {
	// Global imports:
	const { context } = window.Wikia.adEngine;
	const { utils } = window.Wikia.adProducts;
	const { bidders } = window.Wikia.adProductsBidders;
	// End of imports

	const slotName = slot.getSlotName();
	const realSlotPrices = bidders.getDfpSlotPrices(slotName);
	const currentSlotPrices = bidders.getCurrentSlotPrices(slotName);

	function transformBidderPrice(bidderName) {
		if (realSlotPrices && realSlotPrices[bidderName]) {
			return realSlotPrices[bidderName];
		}

		if (currentSlotPrices && currentSlotPrices[bidderName]) {
			return `${currentSlotPrices[bidderName]}not_used`;
		}

		return '';
	}

	return {
		pv_unique_id: window.pvUID,
		pv: window.pvNumber,
		browser: data.browser,
		country: utils.getCountryCode(),
		time_bucket: data.time_bucket,
		timestamp: data.timestamp,
		device: context.get('state.deviceType'),
		ad_load_time: data.timestamp - window.performance.timing.connectStart,
		product_lineitem_id: data.line_item_id || '',
		creative_id: data.creative_id || '',
		creative_size: data.creative_size || '',
		slot_size: data.creative_size || '',
		ad_status: data.status,
		page_width: data.page_width,
		viewport_height: data.viewport_height,
		bidder_1: transformBidderPrice('indexExchange'),
		bidder_2: transformBidderPrice('appnexus'),
		bidder_4: transformBidderPrice('rubicon'),
		bidder_6: transformBidderPrice('aol'),
		bidder_7: transformBidderPrice('audienceNetwork'),
		bidder_9: transformBidderPrice('openx'),
		bidder_10: transformBidderPrice('appnexusAst'),
		bidder_11: transformBidderPrice('rubicon_display'),
		bidder_12: transformBidderPrice('a9'),
		bidder_13: transformBidderPrice('onemobile'),
		bidder_14: transformBidderPrice('pubmatic'),
		bidder_15: transformBidderPrice('beachfront'),
		bidder_16: transformBidderPrice('appnexusWebAds'),
		bidder_17: transformBidderPrice('kargo'),
		kv_skin: context.get('targeting.skin'),
		kv_pos: getPosParameter(slot.getTargeting()),
		kv_wsi: slot.getTargeting().wsi || '',
		kv_rv: slot.getTargeting().rv || '',
		kv_lang: context.get('targeting.lang') || '',
		kv_s0: context.get('targeting.s0'),
		kv_s1: context.get('targeting.s1'),
		kv_s2: context.get('targeting.s2'),
		kv_s0v: context.get('targeting.s0v') || '',
		kv_ah: window.document.body.scrollHeight,
		kv_esrb: context.get('targeting.esrb'),
		kv_ref: context.get('targeting.ref'),
		kv_top: context.get('targeting.top'),
		labrador: utils.getSamplingResults().join(';'),
		opt_in: checkOptIn()
		// Missing:
		// bidder_won, bidder_won_price, page_layout, rabbit, scroll_y, product_chosen
	};
}

/**
 * Wrapper for player data warehouse tracking
 */
export default {
	/**
	 * Checks whether tracker is enabled via instant global
	 * @returns {boolean}
	 */
	isEnabled() {
		// Global imports:
		const { context } = window.Wikia.adEngine;
		// End of imports

		return context.get('options.tracking.kikimora.slot');
	},

	/**
	 * Track render ended event to data warehouse
	 * @param {Object} adSlot
	 * @param {Object} data
	 * @returns {void}
	 */
	onRenderEnded(adSlot, data) {
		M.tracker.Internal.track(trackingRouteName, prepareData(adSlot, data));
	},

	/**
	 * Track status changed event (other than success and collapse) to data warehouse
	 * @param {Object} adSlot
	 * @param {Object} data
	 * @returns {void}
	 */
	onStatusChanged(adSlot, data) {
		const status = adSlot.getStatus();

		if (onChangeStatusToTrack.indexOf(status) !== -1) {
			M.tracker.Internal.track(trackingRouteName, prepareData(adSlot, data));
		}
	},
};
