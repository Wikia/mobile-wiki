/// <reference path="../baseline/Wikia.d.ts" />

module Wikia.Utils.tracking.googleAnalytics {
	export function track () {
		var gaTracker = Wikia.Modules.GoogleAnalyticsTracker.getInstance({global: window});
		gaTracker.trackPageView();
	}
}
