import { track } from '../../../utils/track';

const googleAnalyticsSettings = {
  name: 'babdetector',
  dimension: 6,
};

let status = false;
let detectionCompleted = false;

function trackBlocking(isAdBlockDetected) {
  const value = isAdBlockDetected ? 'Yes' : 'No';

  status = isAdBlockDetected;
  detectionCompleted = true;

  M.tracker.UniversalAnalytics.setDimension(googleAnalyticsSettings.dimension, value);
  track({
    action: 'impression',
    category: `ads-${googleAnalyticsSettings.name}-detection`,
    label: value
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
