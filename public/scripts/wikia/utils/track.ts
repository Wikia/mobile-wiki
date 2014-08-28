/// <reference path="../modules/internalTracking.ts" />
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

interface InternalTrackingConfig {
	c: Number;
	x: String;
	a: String;
	lc: String;
	n: Number;
	u: Number;
	s: String;
	beacon: String;
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
	function init(): void {
		config = {
			c: 123,
			x: window.Wikia.wiki.siteName,
			a: window.Wikia.article.details.title,
			lc: window.Wikia.wiki.language,
			n: 1,
			u: 0,
			s: 'mercury',
			beacon: '',
			cb: ~~(Math.random() * 99999)
		};

		tracker = new Wikia.Modules.InternalTracker({
			baseUrl: 'http://a.wikia-beacon.com/__track/special/',
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

	function gaTrack(gaqArgs: any[]): void {
		var ga = window.ga;

		if (!ga) {
			throw Error('Google Analytics not found!');
		}

		gaqArgs.unshift('send', 'event');
		ga.apply(window, gaqArgs);
	}

	function hasValidGaqArguments(obj: any) {
		return !!(obj.action && obj.category && obj.label);
	}

	export function track(event: string, params: any): void {
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
			tracker.track(event, params);
		}

	}
}
