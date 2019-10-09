import { track } from '../../../utils/track';

/**
  * Wrapper for page info warehouse tracking
  */
export const pageTracker = {
  /**
   * Checks whether tracker is enabled via instant global
   * @returns {boolean}
   */
  isEnabled() {
    // Global imports:
    const { context } = window.Wikia.adEngine;
    // End of imports

    return context.get('options.tracking.slot.status');
  },

  /**
  * Track page info prop values
  * @param {String} name
  * @param {String} value
  * @returns {void}
  */
  trackProp(name, value, force = false) {
    if (!force && !this.isEnabled()) {
      return;
    }

    const now = new Date();
    track({
      eventName: 'adengpageinfo_props',
      trackingMethod: 'internal',
      prop_name: name,
      prop_value: value,
      timestamp: now.getTime(),
      tz_offset: now.getTimezoneOffset(),
    });
  },
};

export default pageTracker;
