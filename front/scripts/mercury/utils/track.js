/* eslint no-console: 0 */

import Comscore from '../modules/Trackers/Comscore';
import Internal from '../modules/Trackers/Internal';
import Krux from '../modules/Trackers/Krux';
import Quantserve from '../modules/Trackers/Quantserve';
import UniversalAnalytics from '../modules/Trackers/UniversalAnalytics';

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
 * @property {Function} updateTrackedUrl
 * @property {boolean} usesAdsContext
 */

const trackers = {
		Comscore,
		Internal,
		Krux,
		Quantserve,
		UniversalAnalytics
	},
	/**
	 * These actions were ported over from legacy Wikia app code:
	 * https://github.com/Wikia/app/blob/dev/resources/wikia/modules/tracker.stub.js
	 * The property keys were modified to fit style rules
	 */
	trackActions = {
		// Generic add
		add: 'add',
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
		// Generic hover
		hover: 'hover',
		// impression of item on page/module
		impression: 'impression',
		// App installation
		install: 'install',
		// Generic keypress
		keypress: 'keypress',
		paginate: 'paginate',
		// Video play
		playVideo: 'play-video',
		// Removal
		remove: 'remove',
		// Generic open
		open: 'open',
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
 * @returns {boolean}
 */
function isSpecialWiki() {
	try {
		return Boolean(M.prop('isGASpecialWiki') || Mercury.wiki.isGASpecialWiki);
	} catch (e) {
		// Property doesn't exist
		return false;
	}
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

	let tracker,
		uaTracker;

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

		uaTracker = new trackers.UniversalAnalytics(isSpecialWiki());
		uaTracker.track(category, action, label, value, isNonInteractive);
	}

	if (trackingMethod === 'both' || trackingMethod === 'internal') {
		tracker = new trackers.Internal();
		params = $.extend(context, params);
		tracker.track(params);
	}
}

/**
 * function for aggregating all page tracking that Wikia uses.
 * To make trackPageView work with your tracker,
 * make it a class in Mercury.Modules.Trackers and export one function 'trackPageView'
 *
 * trackPageView is called in ArticleView.onArticleChange
 *
 * @param {*} adsContext
 * @returns {void}
 */
export function trackPageView(adsContext) {
	if (M.prop('queryParams.noexternals')) {
		return;
	}

	Object.keys(trackers).forEach((tracker) => {
		const Tracker = trackers[tracker];

		if (typeof Tracker.prototype.trackPageView === 'function') {
			const instance = new Tracker(isSpecialWiki());

			console.info('Track pageView:', tracker);
			instance.trackPageView(instance.usesAdsContext ? adsContext : context);
		}
	});
}

/**
 * Track usage of Google Custom Search
 *
 * @param {string} queryParam
 * @returns {void}
 */
export function trackGoogleSearch(queryParam) {
	if (M.prop('queryParams.noexternals')) {
		return;
	}

	Object.keys(trackers).forEach((tracker) => {
		const Tracker = trackers[tracker];

		if (typeof Tracker.prototype.trackGoogleSearch === 'function') {
			const instance = new Tracker(isSpecialWiki());

			console.info('Track Google Search:', tracker);
			instance.trackGoogleSearch(queryParam);
		}
	});
}

/**
 * Function that updates tracker's saved location to given path.
 * To be called after transition so tracker knows that URL is new.
 *
 * This is essential for UA pageview tracker which get's location
 * from window on page load and never updates it (despite changing
 * title) - all subsequent events including pageviews are tracked
 * for original location.
 *
 * @param {string} url
 * @returns {void}
 */
export function updateTrackedUrl(url) {
	if (M.prop('queryParams.noexternals')) {
		return;
	}

	Object.keys(trackers).forEach((tracker) => {
		const Tracker = trackers[tracker];

		if (typeof Tracker.prototype.updateTrackedUrl === 'function') {
			const instance = new Tracker(isSpecialWiki());

			instance.updateTrackedUrl(url);
		}
	});
}

/**
 * @param {TrackContext} data
 * @returns {void}
 */
export function setTrackContext(data) {
	context = data;
}

export {trackActions};
