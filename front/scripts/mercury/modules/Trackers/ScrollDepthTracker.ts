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

// TODO: confirm if it's correct way of handling TypeScript error?
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

		trackPageView (): void {
			this.scrollDepth.resetCache();
		}
	}
}
