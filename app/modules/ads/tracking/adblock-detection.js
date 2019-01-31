import { track } from '../../../utils/track';

const googleAnalyticsSettings = {
  name: 'babdetector',
  dimension: 6,
};

let status = false;
let detectionCompleted = false;

function trackBlocking(isAdBlockDetected) {
  const value = isAdBlockDetected ? 'Yes' : 'No';
  const category = `ads-${googleAnalyticsSettings.name}-detection`;

  status = isAdBlockDetected;
  detectionCompleted = true;

  M.tracker.UniversalAnalytics.setDimension(googleAnalyticsSettings.dimension, value);
  M.tracker.UniversalAnalytics.track(category, 'impression', value, 0, true);
  track({
    trackingMethod: 'internal',
    ga_action: 'impression',
    ga_category: category,
    ga_label: value,
    ga_value: 0,
  });
}

function run() {
  // Global imports:
  const { checkBlocking } = window.Wikia.adEngine.utils.client;
  // End of imports

  if (!detectionCompleted) {
    checkBlocking(
      () => trackBlocking(true),
      () => trackBlocking(false),
    );
  } else {
    trackBlocking(status);
  }
}

export default {
  run,
};
