import {
  setAverageSessionScrollSpeed,
  trackScrollY,
} from '../../../utils/track';

class ScrollTracker {
  constructor() {
    this.scrollSpeedTrackingStarted = false;
    this.timer = null;
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
    let startScrollY = 0;
    this.scrollSpeedTrackingStarted = true;

    timesToTrack.forEach((time) => {
      this.timer = setTimeout(() => {
        const scrollY = window.scrollY || window.pageYOffset;
        trackScrollY(time, scrollY);
        if (time === Math.min(...timesToTrack)) {
          startScrollY = scrollY;
        }
        if (time === Math.max(...timesToTrack)) {
          const newSpeedRecord = scrollY - startScrollY;
          setAverageSessionScrollSpeed(newSpeedRecord);
        }
      }, time * 1000);
    });
  }

  /**
   * Remove scroll tracking from the page
   */
  resetScrollSpeedTracking() {
    const applicationArea = document.getElementsByClassName('application-wrapper')[0];
    clearTimeout(this.timer);
    applicationArea.removeEventListener('touchstart', () => this.trackScrollSpeedToDW());
  }
}

export const scrollTracker = new ScrollTracker();

export default scrollTracker;
