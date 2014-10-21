/// <reference path="../baseline/mercury.d.ts" />

module Mercury.Utils.tracking.googleAnalytics {
	export function track () {
		var gaTracker = Mercury.Modules.GoogleAnalyticsTracker.getInstance({global: window});
		gaTracker.trackPageView();
	}
}
