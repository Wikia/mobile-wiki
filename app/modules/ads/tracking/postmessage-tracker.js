import { track, TrackingMethod } from '../../../utils/track';

export function registerPostmessageTrackingTracker() {
  const {
    GAMOrigins,
    PostmessageTracker,
    TrackingTarget,
    trackingPayloadValidationMiddleware,
  } = window.Wikia.adEngine;

  const postmessageTracker = new PostmessageTracker(
    ['payload', 'target'],
  );

  return postmessageTracker
    .add(trackingPayloadValidationMiddleware)
    .register(
      (message) => {
        const { target, payload } = message;

        switch (target) {
          case TrackingTarget.GoogleAnalytics: {
            track(Object.assign({}, payload, {
              eventName: 'trackingevent',
              trackingMethod: TrackingMethod.ga,
            }), false);
            break;
          }
          case TrackingTarget.DataWarehouse:
            track(Object.assign({}, payload, {
              eventName: 'trackingevent',
              trackingMethod: TrackingMethod.internal,
            }), false);
            break;
          default:
            break;
        }
      },
      [window.origin, ...GAMOrigins],
    );
}

export default registerPostmessageTrackingTracker;
