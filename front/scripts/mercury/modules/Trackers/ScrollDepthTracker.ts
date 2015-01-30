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
		scrollDepth: ScrollDepth;

		constructor () {
			this.scrollDepth = jQuery.scrollDepth({
				unattachEventOnceCacheIsFull: false,
				eventHandler: function(data: ScrollDepthOptions) {
					console.log(data);
				}
			});
		}

		reset (): void {
			this.scrollDepth.resetCache();
		}
	}
}
