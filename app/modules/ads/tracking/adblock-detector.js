import { track } from '../../../utils/track';

class AdBlockDetector {
  constructor() {
    this.googleAnalyticsSettings = {
      name: 'babdetector',
      dimension: 6,
    };
    this.status = false;
    this.detectionCompleted = false;
  }

  run() {
    if (!AdBlockDetector.isEnabled()) {
      return;
    }

    // Global imports:
    const { client } = window.Wikia.adEngine.utils;
    // End of imports

    if (!this.detectionCompleted) {
      client.checkBlocking(
        () => this.trackBlocking(true),
        () => this.trackBlocking(false),
      );
    } else {
      this.trackBlocking(this.status);
    }
  }

  /**
   * @private
   */
  static isEnabled() {
    // Global imports:
    const { context } = window.Wikia.adEngine;
    // End of imports

    return context.get('options.wad.enabled');
  }

  /**
   * @private
   * @param isAdBlockDetected
   */
  trackBlocking(isAdBlockDetected) {
    const value = isAdBlockDetected ? 'Yes' : 'No';
    const category = `ads-${this.googleAnalyticsSettings.name}-detection`;

    this.status = isAdBlockDetected;
    this.detectionCompleted = true;

    M.tracker.UniversalAnalytics.setDimension(this.googleAnalyticsSettings.dimension, value);
    M.tracker.UniversalAnalytics.track(category, 'impression', value, 0, true);
    track({
      trackingMethod: 'internal',
      ga_action: 'impression',
      ga_category: category,
      ga_label: value,
      ga_value: 0,
    });
  }
}

export const adblockDetector = new AdBlockDetector();

export default adblockDetector;
