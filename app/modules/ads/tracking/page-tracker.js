const trackingPropRouteName = 'special/adengpageinfo_props';

/**
  * Wrapper for page info warehouse tracking
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
  * Track page info prop values
  * @param {String} name
  * @param {String} value
  * @returns {void}
  */
  trackProp(name, value) {
    M.tracker.Internal.track(trackingPropRouteName, {
      pv_unique_id: window.pvUID,
      prop_name: name,
      prop_value: value,
      timestamp: (new Date()).getTime(),
    });
  },
};
