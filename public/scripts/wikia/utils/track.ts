/// <reference path="../modules/Trackers/Internal.ts" />
/// <reference path="../modules/Trackers/GoogleAnalytics.ts" />

interface Window {
	ga: any;
	Wikia: any;
}

interface TrackingMethods {
	[idx: string]: any;
	both?: Boolean;
	ga?: Boolean;
	internal?: Boolean;
}

interface TrackingParams {
	[idx: string]: any;
	action?: string;
	label?: string;
	value?: number;
	category?: string;
	trackingMethod: string;
}

module Wikia.Utils {
	var config: InternalTrackingConfig,
	    tracker: Wikia.Modules.InternalTracker,
	    gaTracker: Wikia.Modules.GoogleAnalyticsTracker,
	    global = window,
	    // These actions were ported over from legacy Wikia app code:
		// https://github.com/Wikia/app/blob/dev/resources/wikia/modules/tracker.stub.js
		// The property keys were modified to fit style rules
		actions = {
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
			// Generic keypress
			keypress: 'keypress',
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

	function hasValidGaqArguments (obj: TrackingParams) {
		return !!(obj.category && obj.label);
	}

	function pruneParamsForInternalTrack (params: TrackingParams) {
		delete params.action;
		delete params.label;
		delete params.value;
		delete params.category;
	}

	export function track (params: TrackingParams): void {
		var trackingMethod: string = params.trackingMethod || 'both',
		    track: TrackingMethods = {},
		    action: string = params.action,
		    category: string = params.category ? 'mercury-' + params.category : null,
		    label: string = params.label || '',
		    value: number = params.value || 0;
			tracker = Wikia.Modules.Trackers.Internal.getInstance(),
			gaTracker = Wikia.Modules.Trackers.GoogleAnalytics.getInstance();

		track[trackingMethod] = true;

		if (track.none) {
			throw new Error('must specify a tracking method');
		}

		if (track.both) {
			params = <TrackingParams>$.extend({
				ga_action: action,
				ga_category: category,
				ga_label: label,
				ga_value: value
			}, params);

			track.ga = true;
			track.internal = true;
		}

		if (track.ga) {
			if (!category || !action) {
				throw new Error('missing required GA params');
			}
			gaTracker.track(category, actions[params.action], label, value, true);
		}

		if (track.internal) {
			pruneParamsForInternalTrack(params);
			tracker.track(params);
		}
	}

	/**
	 * function for aggregating all page tracking that Wikia uses.
	 * To make trackPageView work with your tracker,
	 * make it a class in Wikia.Modules.Trackers and export one function 'trackPageView'
	 *
	 * trackPageView is called in ArticleView.onArticleChange
	 */
	export function trackPageView (data: {title: string; ns: number}) {
		var trackers = Em.get('Wikia.Modules.Trackers');

		Object.keys(trackers).forEach(function (tracker) {
			var trackerClass = trackers[tracker];

			if (trackerClass && trackerClass.getInstance) {
				var trackerInstance = trackerClass.getInstance();

				if (trackerInstance && trackerInstance.trackPageView) {
					Em.Logger.info('Track pageView:', tracker);
					trackerInstance.trackPageView(data);
				}
			} else {
				Em.Logger.info('Tracker', tracker, 'has no getInstance method');
			}
		});
	}

	// Export actions so that they're accessible as W.track.actions
	track.actions = actions;
}
