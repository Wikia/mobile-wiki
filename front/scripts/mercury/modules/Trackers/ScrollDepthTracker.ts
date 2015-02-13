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
		scrollDepthSample: Number;

		constructor () {
			// TODO make it lower after successful QA
			this.scrollDepthSample = 100;
			this.gaTracker = new Mercury.Modules.Trackers.GoogleAnalytics();
			this.scrollDepth = jQuery.scrollDepth({
				detachEventOnceCacheIsFull: false,
				percentage: false,
				pixelDepth: false,
				userTiming: false, // if we want to track it we'll need _trackTiming implementation in GoogleAnalytics.ts
				minHeight: 750,
				threshold: 500,
				eventHandler: (data: ScrollDepthEventData) => {
					if (Math.random() * 100 <= this.scrollDepthSample) {
						Em.Logger.info('Sending scroll depth tracking');
						this.gaTracker.trackAds.apply(this.gaTracker, [
							data.eventCategory,
							data.eventAction,
							data.eventLabel
						]);
					}
				}
			});
		}

		reset (): void {
			this.scrollDepth.reset();
		}
	}
}
