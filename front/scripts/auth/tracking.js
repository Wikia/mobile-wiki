import AuthTracker from './common/AuthTracker';
import UniversalAnalytics from '../mercury/modules/Trackers/UniversalAnalytics';
import {trackActions} from '../mercury/utils/track';
import {getQueryParam} from '../mercury/utils/queryString';

(function () {
	/**
	 * @returns {void}
	 */
	function setTrackingDimensions() {
		const dimensions = [];

		// Skin
		dimensions[4] = 'mercury';
		// LoginStatus
		dimensions[5] = 'anon';
		// Page type
		dimensions[8] = 'authPage';
		// IsCorporatePage
		dimensions[15] = 'No';
		// newAuthEntryPage
		dimensions[10] = getQueryParam('redirect');

		UniversalAnalytics.setDimensions(dimensions);
	}

	/**
	 * Auth pages live on www.wikia.com and don't have access to WikiVariables
	 * hence there's a need to provide this data inline
	 *
	 * @returns {void}
	 */
	function setupTracking() {
		M.provide('wiki', {
			id: 80433,
			dbName: 'wikiaglobal',
			language: {
				user: 'en',
			},
		});

		setTrackingDimensions();
	}

	/**
	 * @returns {void}
	 */
	function setTrackingForSignInPage() {
		const tracker = new AuthTracker('user-login-mobile', '/signin');

		// Impression of the Signin page
		tracker.trackPageView();

		// Click "Sign In" button
		tracker.trackSubmit(
			document.getElementById('loginForm'),
			'login-submit'
		);

		// Click X to "close" log-in form
		tracker.trackClick(
			document.querySelector('.close'),
			'login-modal',
			trackActions.close
		);

		// Click "Forgot Password" link
		tracker.trackClick(
			document.querySelector('.forgotten-password'),
			'forgot-password-link'
		);

		// Click "Register Now" link
		tracker.trackClick(
			document.querySelector('.footer-callout-link'),
			'register-link'
		);
	}

	/**
	 * @returns {void}
	 */
	function setTrackingForRegisterPage() {
		const tracker = new AuthTracker('user-signup-mobile', '/register');

		// Impression of the Register page
		tracker.trackPageView();

		// Click "Sign In" button
		tracker.trackSubmit(
			document.getElementById('signupForm'),
			'register-submit'
		);

		// Click X to "close" log-in form
		tracker.trackClick(
			document.querySelector('.close'),
			'register-modal',
			trackActions.close
		);

		// Click "Register Now" link
		tracker.trackClick(
			document.querySelector('.footer-callout-link'),
			'signin-link-on-register-page'
		);
	}

	/**
	 * @returns {void}
	 */
	function setTrackingForJoinPage() {
		const tracker = new AuthTracker('user-login-mobile', '/join');

		// Impression of the Join page
		tracker.trackPageView();

		// Click "Register With Email" button
		tracker.trackClick(
			document.querySelector('.signup-provider-email'),
			'register-email-button'
		);

		// Click "Connect with Facebook" button
		tracker.trackClick(
			document.querySelector('.signup-provider-facebook'),
			'facebook-connect-button'
		);

		// Click "Sign in" link on the bottom of the page
		tracker.trackClick(
			document.querySelector('.footer-callout-link'),
			'sign-in-link'
		);

		// Click X to "close" /join page
		tracker.trackClick(
			document.querySelector('.close'),
			'join-close-button',
			trackActions.close
		);

		// Click on 'connect with facebook'
		tracker.trackClick(
			document.querySelector('.signup-provider-facebook'),
			'facebook-login-button',
			trackActions.click
		);
	}

	/**
	 * @returns {void}
	 */
	function setTrackingForFBConnectPage() {
		const tracker = new AuthTracker('user-signup-mobile', '/signin');

		// Impression of the Facebook Connect page
		tracker.trackPageView();

		// Click "Connect" button
		tracker.trackSubmit(
			document.getElementById('facebookConnectForm'),
			'facebook-connect-submit'
		);

		// Click X to "close" log-in form
		tracker.trackClick(
			document.querySelector('.close'),
			'facebook-connect-close-button',
			trackActions.close
		);

		// Click "Forgot Password" link
		tracker.trackClick(
			document.querySelector('.forgotten-password'),
			'facebook-connect-forgot-password-link'
		);

		// Click "Register Now" link
		tracker.trackClick(
			document.querySelector('.footer-callout-link'),
			'facebook-connect-register-link'
		);
	}

	/**
	 * @returns {void}
	 */
	function setTrackingForFBRegisterPage() {
		const tracker = new AuthTracker('user-signup-mobile', '/register');

		// Impression of the Facebook Register page
		tracker.trackPageView();

		// Click "Register" button
		tracker.trackSubmit(
			document.getElementById('facebookRegistrationForm'),
			'facebook-register-submit'
		);

		// Click X to "close" log-in form
		tracker.trackClick(
			document.querySelector('.close'),
			'facebook-register-close-button',
			trackActions.close
		);

		// Click "Connect it" link
		tracker.trackClick(
			document.querySelector('.footer-callout-link'),
			'facebook-register-connect-link'
		);
	}

	/**
	 * @returns {void}
	 */
	function init() {
		setupTracking();

		const pageType = document.body.getAttribute('data-page-type'),
			trackingSets = {
				'join-page': setTrackingForJoinPage,
				'signin-page': setTrackingForSignInPage,
				'register-page': setTrackingForRegisterPage,
				'fb-connect-page': setTrackingForFBConnectPage,
				'register-fb-page': setTrackingForFBRegisterPage
			};

		if (!pageType || !trackingSets[pageType]) {
			return;
		}

		trackingSets[pageType]();
	}

	/**
	 * @returns {void}
	 */
	document.addEventListener('DOMContentLoaded', () => {
		init();
	});
})();

