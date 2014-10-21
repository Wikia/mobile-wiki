/// <reference path="../modules/InternalTracking.ts" />
/// <reference path="../modules/GoogleAnalyticsTracking.ts" />

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

interface InternalTrackingConfig {
	// TODO: These are legacy config values that are terse and very coupled with MW, lets see if we can't
	// deprecate these and use something a bit more appropriate
	// wgCityId
	c: Number;
	// wgDBname
	x: String;
	// wgArticleId
	a: String;
	// wgContentLanguage
	lc: String;
	// wgNamespaceNumber
	n: Number;
	// trackID || wgTrackID || 0
	u: Number;
	// skin
	s: String;
	// beacon_id || ''
	beacon: String;
	// cachebuster
	cb: Number;
}

module Wikia.Utils {
	var config: InternalTrackingConfig,
	    tracker: Wikia.Modules.InternalTracker,
	    gaTracker: Wikia.Modules.GoogleAnalyticsTracker,
	    actions: any,
	    inited = false,
	    global = window;

	/**
	* @description Init function used to defer the binding of global variables until app is inited,
	* mostly for testing
	*/
	function init (): void {
		config = {
			c: global.Wikia.wiki.id,
			x: global.Wikia.wiki.dbName,
			a: global.Wikia.article.details.title,
			lc: global.Wikia.wiki.language,
			n: global.Wikia.article.details.ns,
			u: 0,
			s: 'mercury',
			beacon: '',
			cb: ~~(Math.random() * 99999)
		};

		tracker = Wikia.Modules.InternalTracker.getInstance({
			baseUrl: 'http://a.wikia-beacon.com/__track/',
			defaults: config
		});
		gaTracker = Wikia.Modules.GoogleAnalyticsTracker.getInstance();

		inited = true;
	}

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
		// Page to next/previous
		paginate: 'paginate',
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

	function pruneParamsForInternalTrack (params: TrackingParams) {
		delete params.action;
		delete params.label;
		delete params.value;
		delete params.category;
	}

	export function track (params: TrackingParams): void {
		var browserEvent = window.event,
		    trackingMethod: string = params.trackingMethod || 'both',
		    track: TrackingMethods = {},
		    action: string = params.action,
		    category: string = params.category ? 'mercury-' + params.category : null,
		    label: string = params.label || '',
		    value: number = params.value || 0;

		track[trackingMethod] = true;

		if (!inited) {
			init();
		}

		if (track.both) {
			params = $.extend({
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

	// Export actions so that they're accessible as W.track.actions
	track.actions = actions;
}
