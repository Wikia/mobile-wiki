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

// TODO: confirm if it's correct way of handling TypeScript error?
interface JQueryStatic {
	scrollDepth(options: ScrollDepthOptions): void;
}

module Mercury.Modules.Trackers {
	export class ScrollDepthTracker {
		constructor () {
			jQuery.scrollDepth({
				unattachEventOnceCacheIsFull: false,
				eventHandler: function(data: ScrollDepthOptions) {
					console.log(data);
				}
			});
		}
	}
}
