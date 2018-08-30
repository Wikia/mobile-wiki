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
  const { context, slotService, utils } = window.Wikia.adEngine;
  const { getCountryCode } = window.Wikia.adProducts.utils;
  // End of imports

  const slot = slotService.get(data.slotName);

  return {
    pv_unique_id: window.pvUID,
    pv_number: window.pvNumber,
    country: getCountryCode(),
    skin: context.get('targeting.skin'),
    wsi: slot.getTargeting().wsi || '',
    player: playerName,
    ad_product: data.adProduct,
    position: (data.slotName || '').toLowerCase(),
    event_name: eventName,
    ad_error_code: errorCode,
    content_type: data.contentType,
    line_item_id: data.lineItemId || '',
    creative_id: data.creativeId || '',
    timestamp: new Date().getTime(),
    price: '',
    browser: `${utils.client.getOperatingSystem()} ${utils.client.getBrowser()}`,
    ctp: data.withCtp ? 1 : 0,
    audio: data.withAudio ? 1 : 0,
    video_id: data.videoId || '',
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
    if (
      !window.Wikia.adEngine
      || !window.Wikia.adProducts
      || !data.adProduct
      || !playerName
      || !eventName) {
      return;
    }

    // Global imports:
    const { context } = window.Wikia.adEngine;
    // End of imports

    if (context.get('options.tracking.kikimora.player')) {
      const trackingData = prepareData(data, playerName, eventName, errorCode);

      M.tracker.Internal.track(trackingRouteName, trackingData);
    }
  }
}
