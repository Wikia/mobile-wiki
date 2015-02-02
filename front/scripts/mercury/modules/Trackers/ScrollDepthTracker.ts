/// <reference path="../../utils/track.ts" />
/// <reference path="GoogleAnalytics.ts" />

interface ScrollDepthOptions {
	minHeight?: Number;
	elements?: Array<String>;
	percentage?: Boolean;
	userTiming?: Boolean;
	pixelDepth?: Boolean;
	nonInteraction?: Boolean;
	unattachEventOnceCacheIsFull?: Boolean;
	eventHandler: any;
}

interface ScrollDepthEventData {
	event: String;
	eventCategory: String;
	eventAction: String;
	eventLabel: String;
	eventNonInteraction?: Boolean;
	eventValue?: Number;
	eventTiming?: Number;
}

interface ScrollDepth {
	reset(): void;
}

interface JQueryStatic {
	scrollDepth(options: ScrollDepthOptions): ScrollDepth;
}

module Mercury.Modules.Trackers {
	export class ScrollDepthTracker {
		gaTracker: GoogleAnalytics;
		scrollDepth: ScrollDepth;

		constructor () {
			this.gaTracker = new Mercury.Modules.Trackers.GoogleAnalytics();
			this.scrollDepth = jQuery.scrollDepth({
				unattachEventOnceCacheIsFull: false,
				userTiming: false, // if we want to track it we'll need _trackTiming implementation in GoogleAnalytics.ts
				eventHandler: (data: ScrollDepthEventData) => {
					Em.Logger.info('Sending scroll depth tracking');
					this.gaTracker.trackAds.apply(this.gaTracker, [
						data.eventCategory,
						data.eventAction,
						data.eventLabel
					]);
				}
			});
		}

		reset (): void {
			this.scrollDepth.reset();
		}
	}
}
