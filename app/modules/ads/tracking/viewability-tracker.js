const trackingRouteName = 'special/adengviewability';

/**
 * Prepare data for render ended tracking
 * @param {Object} slot
 * @param {Object} data
 * @returns {Object}
 */
function prepareData(slot, data) {

  return {
    pv_unique_id: window.pvUID,
    wsi: slot.getTargeting().wsi || '',
    line_item_id: data.line_item_id,
    creative_id: data.creative_id,
    rv: slot.getTargeting().rv || 1,
    timestamp: data.timestamp,
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

    return context.get('options.tracking.kikimora.viewability');
  },

  /**
	 * Track viewabiltiy impression to data warehouse
	 * @param {Object} adSlot
	 * @param {Object} data
	 * @returns {void}
	 */
  onImpressionViewable(adSlot, data) {
    M.tracker.Internal.track(trackingRouteName, prepareData(adSlot, data));
  },
};
