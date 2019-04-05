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
    const { eventService } = window.Wikia.adEngine;
    const { porvataTracker, playerEvents } = window.Wikia.adProducts;

    eventService.on(playerEvents.VIDEO_PLAYER_TRACKING_EVENT, trackEvent);

    porvataTracker.register();
  },
};

export default videoTracker;
