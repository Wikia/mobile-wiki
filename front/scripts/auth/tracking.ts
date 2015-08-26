/// <reference path='../baseline/mercury.ts' />
/// <reference path='../mercury/utils/track.ts' />

(function () {
	function checkPageType (pageType: string): boolean {
		return (document.body.className.indexOf(pageType) !== -1);
	}

	function setupTracking(): void {
		//Auth pages live on www.wikia.com and don't have access to WikiVariables
		//hence there's a need to provide this data inline
		M.provide('wiki', {
			id: 80433,
			dbName: 'wikiaglobal',
			language: {
				user: 'en'
			}
		});

		setTrackingDimensions();
	}

	function setTrackingDimensions (): void {
		var dimensions: (string|Function)[] = [];
		// Skin
		dimensions[4] = 'mercury';
		// LoginStatus
		dimensions[5] = 'anon';
		//Page type
		dimensions[8] = 'authPage';
		// IsCorporatePage
		dimensions[15] = 'No';
		Mercury.Modules.Trackers.UniversalAnalytics.setDimensions(dimensions);
	}

	function setTrackingForSignInPage (): void {
		var tracker = new AuthTracker('user-login-mobile', '/signin');

		//Impression of the Signin page
		tracker.trackPageView();

		// Click "Sign In" button
		tracker.trackSubmit(
			<HTMLFormElement> document.getElementById('loginForm'),
			'login-submit'
		);

		// Click X to "close" log-in form
		tracker.trackClick(
			<HTMLElement> document.querySelector('.close'),
			'login-modal',
			Mercury.Utils.trackActions.close
		);

		// Click "Forgot Password" link
		tracker.trackClick(
			<HTMLElement> document.querySelector('.forgotten-password'),
			'forgot-password-link'
		);

		// Click "Register Now" link
		tracker.trackClick(
			<HTMLElement> document.querySelector('.footer-callout-link'),
			'register-link'
		);
	}

	function setTrackingForRegisterPage (): void {
		var tracker = new AuthTracker('user-signup-mobile', '/register');

		//Impression of the Register page
		tracker.trackPageView();

		// Click "Sign In" button
		tracker.trackSubmit(
			<HTMLFormElement> document.getElementById('signupForm'),
			'register-submit'
		);

		// Click X to "close" log-in form
		tracker.trackClick(
			<HTMLElement> document.querySelector('.close'),
			'register-modal',
			Mercury.Utils.trackActions.close
		);

		// Click "Register Now" link
		tracker.trackClick(
			<HTMLElement> document.querySelector('.footer-callout-link'),
			'signin-link-on-register-page'
		);
	}

	function setTrackingForJoinPage(): void {
		var tracker = new AuthTracker('user-login-mobile', '/join');

		//Impression of the Join page
		tracker.trackPageView();

		// Click "Register With Email" button
		tracker.trackClick(
			<HTMLElement> document.querySelector('.signup-provider-email'),
			'register-email-button'
		);

		// Click "Connect with Facebook" button
		tracker.trackClick(
			<HTMLElement> document.querySelector('.signup-provider-facebook'),
			'facebook-connect-button'
		);

		// Click "Sign in" link on the bottom of the page
		tracker.trackClick(
			<HTMLElement> document.querySelector('.footer-callout-link'),
			'sign-in-link'
		);

		// Click X to "close" /join page
		tracker.trackClick(
			<HTMLElement> document.querySelector('.close'),
			'join-close-button',
			Mercury.Utils.trackActions.close
		);

		//Click on 'connect with facebook'
		tracker.trackClick(
			<HTMLElement> document.querySelector('.signup-provider-facebook'),
			'facebook-login-button',
			Mercury.Utils.trackActions.click
		);
	}

	function setTrackingForFBConnectPage () {
		var tracker = new AuthTracker('user-signup-mobile', '/signin');

		//Impression of the Facebook Connect page
		tracker.trackPageView();

		// Click "Connect" button
		tracker.trackSubmit(
			<HTMLFormElement> document.getElementById('facebookConnectForm'),
			'facebook-connect-submit'
		);

		// Click X to "close" log-in form
		tracker.trackClick(
			<HTMLElement> document.querySelector('.close'),
			'facebook-connect-close-button',
			Mercury.Utils.trackActions.close
		);

		// Click "Forgot Password" link
		tracker.trackClick(
			<HTMLElement> document.querySelector('.forgotten-password'),
			'facebook-connect-forgot-password-link'
		);

		// Click "Register Now" link
		tracker.trackClick(
			<HTMLElement> document.querySelector('.footer-callout-link'),
			'facebook-connect-register-link'
		);
	}

	function setTrackingForFBRegisterPage () {
		var tracker = new AuthTracker('user-signup-mobile', '/register');

		//Impression of the Facebook Register page
		tracker.trackPageView();

		// Click "Register" button
		tracker.trackSubmit(
			<HTMLFormElement> document.getElementById('facebookRegistrationForm'),
			'facebook-register-submit'
		);

		// Click X to "close" log-in form
		tracker.trackClick(
			<HTMLElement> document.querySelector('.close'),
			'facebook-register-close-button',
			M.trackActions.close
		);

		// Click "Connect it" link
		tracker.trackClick(
			<HTMLElement> document.querySelector('.footer-callout-link'),
			'facebook-register-connect-link'
		);
	}

	function init (): void {
		var pageType: string,
			trackingSets: any;

		setupTracking();

		trackingSets = {
			'join-page': setTrackingForJoinPage,
			'signin-page': setTrackingForSignInPage,
			'register-page': setTrackingForRegisterPage,
			'fb-connect-page': setTrackingForFBConnectPage,
			'register-fb-page': setTrackingForFBRegisterPage
		};

		Object.keys(trackingSets).some(function (pageType) {
			if (checkPageType(pageType)) {
				trackingSets[pageType]();
				return true;
			}
		});
	}

	document.addEventListener('DOMContentLoaded', function (): void {
		init();
	});
})();

