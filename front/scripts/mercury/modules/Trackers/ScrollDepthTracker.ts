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

interface ScrollDepth {
	resetCache(): void;
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
				eventHandler: (data: ScrollDepthOptions) => {
					Em.Logger.info('Sending scroll depth tracking');
					this.gaTracker.getQueue().push(data);
				}
			});
		}

		reset (): void {
			this.scrollDepth.resetCache();
		}
	}
}
