/* eslint import/no-cycle: 0 */
import { getGroup } from '../modules/abtest';
import { hasMobileAppQueryString } from './mobile-app';

/**
  * @typedef {Object} TrackContext
  * @property {string} a
  * @property {number} n
  */

/**
  * @typedef {Object} TrackingParams
  * @property {string} category
  * @property {string} [action]
  * @property {string} [label]
  * @property {number} [value]
  * @property {string} [trackingMethod]
  * @property {boolean} [isNonInteractive]
  * @property {string} [sourceUrl]
  */

/**
  * @typedef {Object} TrackerInstance
  * @property {Function} track
  * @property {Function} trackPageView
  * @property {boolean} usesAdsContext
  */

/**
  * These actions were ported over from legacy Wikia app code:
  * https://github.com/Wikia/app/blob/dev/resources/wikia/modules/tracker.stub.js
  * The property keys were modified to fit style rules
  */
const trackActions = {
  // Generic add
  add: 'add',
  // During recent operations some data has been changed
  change: 'change',
  // Generic click, mostly javascript clicks
  // NOTE: When tracking clicks, consider binding to 'onMouseDown' instead of 'onClick'
  // to allow the browser time to send these events naturally. For more information on
  // this issue, see the `track()` method in "resources/modules/tracker.js"
  click: 'click',
  // Click on navigational button
  clickLinkButton: 'click-link-button',
  // Click on image link
  clickLinkImage: 'click-link-image',
  // Click on text link
  clickLinkText: 'click-link-text',
  // Generic close
  close: 'close',
  // Clicking okay in a confirmation modal
  confirm: 'confirm',
  // Generic disable
  disable: 'disable',
  // Generic enable
  enable: 'enable',
  // Generic error (generally AJAX)
  error: 'error',
  // Input focus
  focus: 'focus',
  // Generic hover
  hover: 'hover',
  // impression of item on page/module
  impression: 'impression',
  // App installation
  install: 'install',
  // Generic keypress
  keypress: 'keypress',
  // Generic open
  open: 'open',
  paginate: 'paginate',
  // Video play
  playVideo: 'play-video',
  // Removal
  remove: 'remove',
  // selecting item
  select: 'select',
  // Sharing view email, social network, etc
  share: 'share',
  // Form submit, usually a post method
  submit: 'submit',
  // Successful ajax response
  success: 'success',
  // General swipe event
  swipe: 'swipe',
  // Action to take a survey
  takeSurvey: 'take-survey',
  // View
  view: 'view',
};

let context = {
  a: null,
  n: null,
};

/**
  * @param {TrackingParams} params
  * @returns {void}
  */
function pruneParams(params) {
  delete params.action;
  delete params.label;
  delete params.value;
  delete params.category;
  delete params.isNonInteractive;
}

/**
  * @param {string} category
  * @returns {boolean}
  */
function isPageView(category) {
  return category.toLowerCase() === 'view';
}

/**
  * @param {TrackingParams} params
  * @returns {void}
  */
export function track(params) {
  if (!window.location) {
    return;
  }

  if (typeof FastBoot !== 'undefined' || M.getFromHeadDataStore('noExternals')) {
    return;
  }

  const isFandomApp = hasMobileAppQueryString();
  const trackingCategoryPrefix = (isFandomApp ? 'fandom-app' : 'mercury');
  const category = params.category ? `${trackingCategoryPrefix}-${params.category}` : '';
  const isNonInteractive = params.isNonInteractive !== false;
  const pvUID = window.pvUID;
  const {
    action, label = '', value = 0, trackingMethod = 'both',
  } = params;

  params = Object.assign({
    ga_action: action,
    ga_category: category,
    ga_label: label,
    ga_value: value,
    ga_is_nonInteractive: isNonInteractive,
    pv_unique_id: pvUID,
  }, params);

  // We rely on ga_* params in both trackers
  pruneParams(params);

  if (trackingMethod === 'both' || trackingMethod === 'ga') {
    if (!category || !action) {
      throw new Error('Missing required GA params');
    }

    M.trackingQueue.push(() => {
      M.tracker.UniversalAnalytics.track(category, action, label, value, isNonInteractive);
    });
  }

  if (trackingMethod === 'both' || trackingMethod === 'internal') {
    const eventName = params.eventName || 'trackingevent';

    params = Object.assign({}, context, params);
    M.trackingQueue.push((isOptedIn) => {
      M.tracker.Internal.track(
        isPageView(category) ? 'view' : `special/${eventName}`,
        params,
        isOptedIn,
      );
    });
  }
}

/**
  * @param {Boolean} isInitialPageView
  * @param {UniversalAnalyticsDimensions} [uaDimensions]
  * @returns {void}
  */
export function trackPageView(isInitialPageView, uaDimensions) {
  if (typeof FastBoot !== 'undefined') {
    return;
  }

  const enableTracking = !M.getFromHeadDataStore('noExternals');

  if (!isInitialPageView && enableTracking) {
    // Defined in /vendor/inline-scripts/
    M.trackingQueue.push(window.trackQuantcastPageView);
    M.trackingQueue.push(window.trackComscorePageView);
    M.trackingQueue.push((isOptedIn) => {
      M.tracker.Internal.trackPageView(context, isOptedIn);
    });
    M.trackingQueue.push(() => {
      M.tracker.UniversalAnalytics.trackPageView(uaDimensions);
    });
  }
}

/**
 * Tracks scrollY position at given time
 * @param {number} time
 * @param {number} scrollY
 */
export function trackScrollY(time, scrollY) {
  track({
    action: 'scroll',
    category: 'scroll_speed',
    label: `${time}s|${scrollY}`,
  });
}

/**
  * Function to track an experiment specific event. This is currently
  * done due to limitations in the DW when it comes to segmentation
  * of events based on experiment groups
  *
  * @param {String} experiment
  * @param {TrackingParams} params
  * @returns {void}
  */
export function trackExperiment(experiment, params) {
  const group = getGroup(experiment) || 'CONTROL';

  params.label = [experiment, group, params.label].join('=');
  track(params);
}

/**
  * @param {TrackContext} data
  * @returns {void}
  */
export function setTrackContext(data) {
  context = data;
}

export { trackActions };
