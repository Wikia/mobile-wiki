import {track as mercuryTrack, trackActions, trackPageView, setTrackContext} from '../mercury/utils/track';
import UniversalAnalytics from '../mercury/modules/Trackers/UniversalAnalytics';

(function () {
	/**
	 * Track discussions splash page
	 *
	 * @param {string} label
	 * @param {string} [action=trackActions.click]
	 * @returns {void}
	 */
	function track(label, action = trackActions.click) {
		mercuryTrack({
			trackingMethod: 'both',
			action,
			category: 'discussions-splash-page',
			label
		});
	}

	/**
	 * @returns {void}
	 */
	function setTrackingDimensions() {
		const dimensions = [];

		// Skin
		dimensions[4] = 'mercury';
		// LoginStatus
		dimensions[5] = 'anon';
		// PageType
		dimensions[8] = 'discussionsSplashPage';
		// IsCorporatePage
		dimensions[15] = 'No';

		UniversalAnalytics.setDimensions(dimensions);
	}

	/**
	 * @returns {void}
	 */
	function setupTracking() {
		M.provide('wiki', {
			id: window.pageParams.wikiId,
			dbName: window.pageParams.dbName,
			language: {
				user: window.pageParams.language
			}
		});

		setTrackContext({
			a: 'discussions',
			n: -1
		});

		setTrackingDimensions();
	}

	/**
	 * @returns {void}
	 */
	function setTrackingForDiscussionsSplashPage() {
		trackPageView(null);

		document.getElementById('iosLink').addEventListener('click', () => {
			track('ios-appstore-link');
		});

		document.getElementById('androidLink').addEventListener('click', () => {
			track('google-play-link');
		});

		document.querySelector('.wikia-link').addEventListener('click', () => {
			track('back-to-wikia-link');
		});
	}

	document.addEventListener('DOMContentLoaded', () => {
		setupTracking();
		setTrackingForDiscussionsSplashPage();
	});
})();
