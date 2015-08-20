/// <reference path='../baseline/mercury.ts' />
/// <reference path='../mercury/utils/track.ts' />
/// <reference path='../mercury/utils/queryString.ts' />


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
		// IsCorporatePage
		dimensions[15] = 'No';
		// newAuthEntryPage
		dimensions[10] = M.getQueryParam('redirect');
		Mercury.Modules.Trackers.UniversalAnalytics.setDimensions(dimensions);
	}

	function setTrackingForSignInPage (): void {
		var tracker = new AuthTracker('user-login-mobile');

		//Impression of the /signin page
		tracker.trackPageView('signin-page');
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
		var tracker = new AuthTracker('user-signup-mobile');

		//Impression of the /register page
		tracker.trackPageView('register-page');
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
		var tracker = new AuthTracker('user-login-mobile');

		//Impression of the /join page
		tracker.trackPageView('join-page');
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
		var tracker = new AuthTracker('user-signup-mobile');
		//Impression of the /signin page
		tracker.trackPageView('signin-page');
		// Click "Sign In" button
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

	function init (): void {
		setupTracking();

		if (checkPageType('join-page')) {
			setTrackingForJoinPage();
		} else if (checkPageType('signin-page')) {
			setTrackingForSignInPage();
		} else if (checkPageType('register-page')){
			setTrackingForRegisterPage();
		} else if (checkPageType('fb-connect-page')) {
			setTrackingForFBConnectPage();
		}
	}

	document.addEventListener('DOMContentLoaded', function (): void {
		init();
	});
})();

