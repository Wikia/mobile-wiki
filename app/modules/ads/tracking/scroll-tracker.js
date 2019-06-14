import { trackScrollY } from '../../../utils/track';

class ScrollTracker {
  constructor() {
    this.scrollSpeedTrackingStarted = false;
  }

  /**
   * Init scroll speed tracking when enabled
   */
  initScrollSpeedTracking() {
    const { context } = window.Wikia.adEngine;
    if (!context.get('options.scrollSpeedTracking')) {
      return;
    }

    const applicationArea = document.getElementsByClassName('application-wrapper')[0];

    this.scrollSpeedTrackingStarted = false;
    applicationArea.addEventListener('touchstart', () => this.trackScrollSpeedToDW());
  }

  /**
   * Track scrollY to DW in in three 2s-periods
   */
  trackScrollSpeedToDW() {
    if (this.scrollSpeedTrackingStarted) {
      return;
    }

    const timesToTrack = [0, 2, 4];
    this.scrollSpeedTrackingStarted = true;
    timesToTrack.forEach((time) => {
      setTimeout(() => {
        trackScrollY(time);
      }, time * 1000);
    });
  }

  /**
   * Remove scroll tracking from the page
   */
  resetScrollSpeedTracking() {
    const applicationArea = document.getElementsByClassName('application-wrapper')[0];
    applicationArea.removeEventListener('touchstart', () => this.trackScrollSpeedToDW());
  }
}

export const scrollTracker = new ScrollTracker();

export default scrollTracker;
