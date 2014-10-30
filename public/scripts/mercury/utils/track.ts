/// <reference path="../../../../typings/ember/ember.d.ts" />
/// <reference path="../modules/Trackers/Internal.ts" />
/// <reference path="../modules/Trackers/GoogleAnalytics.ts" />

interface Window {
	ga: any;
	Mercury: any;
}

interface TrackContext {
	//article title
	a: string;
	//namespace
	n: number;
}

interface TrackingParams {
	action?: string;
	label?: string;
	value?: number;
	category: string;
	trackingMethod?: string;
	[idx: string]: any;
}

interface TrackFunction {
	(params: TrackingParams): void;
	actions: any;
}

interface TrackerInstance {
	new(): TrackerInstance;
	track: TrackFunction;
	trackPageView: (context?: TrackContext) => void;
}

module Mercury.Utils {
	// These actions were ported over from legacy Wikia app code:
	// https://github.com/Wikia/app/blob/dev/resources/wikia/modules/tracker.stub.js
	// The property keys were modified to fit style rules
	var actions: any = {
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
		},
		context: TrackContext = {
			a: null,
			n: null
		};

	function pruneParams (params: TrackingParams) {
		delete params.action;
		delete params.label;
		delete params.value;
		delete params.category;
	}

	export function track (params: TrackingParams): void {
		var trackingMethod: string = params.trackingMethod || 'both',
		    action: string = params.action,
		    category: string = params.category ? 'mercury-' + params.category : null,
		    label: string = params.label || '',
		    value: number = params.value || 0,
			trackers = Mercury.Modules.Trackers,
			tracker: Mercury.Modules.Trackers.Internal,
			gaTracker: Mercury.Modules.Trackers.GoogleAnalytics;

		params = <TrackingParams>$.extend({
			ga_action: action,
			ga_category: category,
			ga_label: label,
			ga_value: value
		}, params);

		//We rely on ga_* params in both trackers
		pruneParams(params);

		if (trackingMethod === 'both' || trackingMethod === 'ga') {
			if (!category || !action) {
				throw new Error('missing required GA params');
			}

			gaTracker = new trackers.GoogleAnalytics();
			gaTracker.track(category, actions[params.action], label, value, true);
		}

		if (trackingMethod === 'both' || trackingMethod === 'internal') {
			tracker = new trackers.Internal();
			params = <InternalTrackingParams>$.extend(context, params);
			tracker.track(<InternalTrackingParams>params);
		}
	}

	/**
	 * function for aggregating all page tracking that Wikia uses.
	 * To make trackPageView work with your tracker,
	 * make it a class in Mercury.Modules.Trackers and export one function 'trackPageView'
	 *
	 * trackPageView is called in ArticleView.onArticleChange
	 */
	export function trackPageView (adsContext: any) {
		var trackers: {[name: string]: TrackerInstance} = Em.get('Mercury.Modules.Trackers');

		Object.keys(trackers).forEach(function (tracker: string) {
			var trackerInstance = new trackers[tracker]();

			if (trackerInstance && trackerInstance.trackPageView) {
				Em.Logger.info('Track pageView:', tracker);
				trackerInstance.trackPageView(trackerInstance.usesAdsContext ? adsContext : context);
			}
		});
	}

	export function setTrackContext(data: TrackContext) {
		context = data;
	}

	// Export actions so that they're accessible as M.trackActions
	export var trackActions = actions;
}
