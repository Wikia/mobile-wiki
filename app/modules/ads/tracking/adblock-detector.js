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
    // Global imports:
    const { checkBlocking } = window.Wikia.adEngine.utils.client;
    // End of imports

    if (!this.detectionCompleted) {
      checkBlocking(
        () => this.trackBlocking(true),
        () => this.trackBlocking(false),
      );
    } else {
      this.trackBlocking(this.status);
    }
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
