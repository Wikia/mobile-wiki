/// <reference path='../baseline/mercury.ts' />
/// <reference path='../mercury/utils/track.ts' />
/// <reference path='../mercury/utils/queryString.ts' />

(function () {
	function track(label: string, action: string = M.trackActions.click): void {
		M.track({
			trackingMethod: 'both',
			action: action,
			category: 'discussions-splash-page',
			label: label
		});
	}

	function setupTracking(): void {
		M.provide('wiki', {
			id: M.prop('wikiId'),
			dbName: 'wikiaglobal',
			language: {
				user: M.prop('language')
			}
		});

		M.setTrackContext({
			a: 'discussions',
			n: -1
		});

		setTrackingDimensions();
	}

	function setTrackingDimensions (): void {
		var dimensions: (string|Function)[] = [];
		// Skin
		dimensions[4] = 'mercury';
		// LoginStatus
		dimensions[5] = 'anon';
		//PageType
		dimensions[8] = 'discussionsSplashPage';
		// IsCorporatePage
		dimensions[15] = 'No';
		Mercury.Modules.Trackers.UniversalAnalytics.setDimensions(dimensions);
	}

	function setTrackingForDiscussionsSplashPage () {
		M.trackPageView(null);

		document.getElementById('iosLink').addEventListener('click', function () {
			track('ios-appstore-link');
		});

		document.getElementById('androidLink').addEventListener('click', function () {
			track('google-play-link');
		});
	}

	document.addEventListener('DOMContentLoaded', function (): void {
		setupTracking();
		setTrackingForDiscussionsSplashPage();
	});
})();
