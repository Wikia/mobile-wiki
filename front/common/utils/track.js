/* eslint no-console: 0 */

import Ads from '../modules/ads';
import {getGroup} from '../modules/abtest';

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
	view: 'view'
};

let context = {
	a: null,
	n: null
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
	const trackingMethod = params.trackingMethod || 'both',
		action = params.action,
		category = params.category ? `mercury-${params.category}` : null,
		label = params.label || '',
		value = params.value || 0,
		isNonInteractive = params.isNonInteractive !== false;

	if (M.prop('queryParams.noexternals')) {
		return;
	}

	params = $.extend({
		ga_action: action,
		ga_category: category,
		ga_label: label,
		ga_value: value,
		ga_is_nonInteractive: isNonInteractive
	}, params);

	// We rely on ga_* params in both trackers
	pruneParams(params);

	if (trackingMethod === 'both' || trackingMethod === 'ga') {
		if (!category || !action) {
			throw new Error('Missing required GA params');
		}

		M.tracker.UniversalAnalytics.track(category, action, label, value, isNonInteractive);
	}

	if (trackingMethod === 'both' || trackingMethod === 'internal') {
		params = $.extend(context, params);
		M.tracker.Internal.track(isPageView(category) ? 'view' : 'special/trackingevent', params);
	}
}

/**
 * @param {UniversalAnalyticsDimensions} [uaDimensions]
 * @param {string} [overrideUrl] - if you want to override URL sent to UA
 * @returns {void}
 */
export function trackPageView(uaDimensions, overrideUrl) {
	if (M.prop('queryParams.noexternals')) {
		return;
	}

	if (M.prop('initialPageView')) {
		M.prop('initialPageView', false);
	} else {
		window.trackQuantservePageView();
		window.trackNielsenPageView();
		window.trackComscorePageView();

		M.tracker.Internal.trackPageView(context);
		M.tracker.UniversalAnalytics.trackPageView(uaDimensions, overrideUrl);
	}

	window.trackIVW3PageView();
	Ads.getInstance().trackKruxPageView();
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
 * Function to save data about registered users that seen the
 * New Contributor Flow modal
 *
 * @param {TrackingParams} params
 * @returns {void}
 */
export function trackRegister(params) {
	M.tracker.Internal.track('special/newcontributorflow', params);
}

/**
 * @param {TrackContext} data
 * @returns {void}
 */
export function setTrackContext(data) {
	context = data;
}

export {trackActions};
