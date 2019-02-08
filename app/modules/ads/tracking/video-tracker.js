import { track } from '../../../utils/track';

function trackEvent(eventData) {
  track(Object.assign(
    {
      eventName: 'adengplayerinfo',
      trackingMethod: 'internal',
    },
    eventData,
  ));
}

export const videoTracker = {
  register: () => {
    const { events } = window.Wikia.adEngine;
    const { porvataTracker } = window.Wikia.adProducts;

    events.on(events.VIDEO_PLAYER_TRACKING_EVENT, trackEvent);

    porvataTracker.register();
  },
};

export default videoTracker;
