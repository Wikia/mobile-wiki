/// <reference path="../modules/InternalTracking.ts" />
interface Window {
	ga: any;
	Wikia: any;
}

interface TrackingMethods {
	[idx: string]: any;
	both?: Boolean;
	ga?: Boolean;
	internal?: Boolean;
	none?: Boolean;
}

interface TrackingParams {
	[idx: string]: any;
	action?: string;
	label?: string;
	value?: string;
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
	    actions: any,
	    inited = false;

	/**
	* @description Init function used to defer the binding of global variables until app is inited,
	* mostly for testing
	*/
	function init (): void {
		config = {
			c: window.Wikia.wiki.id,
			x: window.Wikia.wiki.dbName,
			a: window.Wikia.article.details.title,
			lc: window.Wikia.wiki.language,
			n: window.Wikia.article.details.ns,
			u: 0,
			s: 'mercury',
			beacon: '',
			cb: ~~(Math.random() * 99999)
		};

		tracker = new Wikia.Modules.InternalTracker({
			baseUrl: 'http://a.wikia-beacon.com/__track/',
			defaults: config
		});

		inited = true;
	}

	// These actions were ported over from legacy Wikia app code:
	// https://github.com/Wikia/app/blob/dev/resources/wikia/modules/tracker.stub.js
	// The property keys were modified to fit style rules
	actions = {
		dd: 'add',
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

	function gaTrack (gaqArgs: any[]): void {
		var ga = window.ga;

		if (!ga) {
			throw Error('Google Analytics not found!');
		}

		gaqArgs.unshift('send', 'event');
		ga.apply(window, gaqArgs);
	}

	function hasValidGaqArguments (obj: TrackingParams) {
		return !!(obj.action && obj.category && obj.label);
	}

	function pruneParamsForInternalTrack (params: TrackingParams) {
		delete params.action;
		delete params.label;
		delete params.value;
		delete params.category;
	}

	export function track (event: string, params: TrackingParams): void {
		var browserEvent = window.event,
		    trackingMethod: string = params.trackingMethod || 'none',
		    track: TrackingMethods = {},
		    action: string = params.action,
		    category: string = params.category,
		    label: string = params.label,
		    value: string = params.value,
		    gaqArgs: any[] = [];

		track[trackingMethod] = true;

		if (!inited) {
			init();
		}

		if (track.none) {
			throw new Error('must specify a tracking method');
		}

		if (track.both) {
			track.ga = true;
			track.internal = true;
			params = $.extend({
				ga_action: action,
				ga_category: category,
				ga_label: label,
				ga_value: value
			}, params);
		}

		if ((track.both || track.ga) && !hasValidGaqArguments(params)) {
			throw new Error('missing required GA params');
		}

		if (track.ga) {
			gaqArgs.push(actions[action], category, label);
			gaqArgs.push(value || '');
			// No-interactive = true
			gaqArgs.push(true);
			gaTrack(gaqArgs);
		}

		if (track.internal) {
			pruneParamsForInternalTrack(params);
			tracker.track(event, params);
		}
	}
}
