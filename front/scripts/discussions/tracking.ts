/// <reference path='../baseline/mercury.ts' />
/// <reference path='../mercury/utils/track.ts' />
/// <reference path='../mercury/utils/queryString.ts' />

interface PageParams {
	language: string;
	dbName: string;
	wikiId: number;
}

interface Window {
	pageParams: PageParams;
}

(function () {
	/**
	 * Track discussions splash page
	 *
	 * @param {String} label
	 * @param {String} [action=M.trackActions.click]
	 * @returns {void}
	 */
	function track(label: string, action: string = M.trackActions.click): void {
		M.track({
			trackingMethod: 'both',
			action: action,
			category: 'discussions-splash-page',
			label: label
		});
	}

	/**
	 * @returns {void}
	 */
	function setupTracking(): void {
		M.provide('wiki', {
			id: window.pageParams.wikiId,
			dbName: window.pageParams.dbName,
			language: {
				user: window.pageParams.language
			}
		});

		M.setTrackContext({
			a: 'discussions',
			n: -1
		});

		setTrackingDimensions();
	}

	/**
	 * @returns {void}
	 */
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

	/**
	 * @returns {void}
	 */
	function setTrackingForDiscussionsSplashPage () {
		M.trackPageView(null);

		document.getElementById('iosLink').addEventListener('click', function () {
			track('ios-appstore-link');
		});

		document.getElementById('androidLink').addEventListener('click', function () {
			track('google-play-link');
		});

		document.querySelector('.wikia-link').addEventListener('click', function () {
			track('back-to-wikia-link');
		});
	}

	document.addEventListener('DOMContentLoaded', function (): void {
		setupTracking();
		setTrackingForDiscussionsSplashPage();
	});
})();
