/// <reference path='../baseline/mercury.ts' />
/// <reference path='../mercury/utils/track.ts' />

(function () {
	function checkPageType (pageType: string): boolean {
		return (document.body.className.indexOf(pageType) !== -1);
	}

	function setTrackingDimensions (): void {
		var dimensions: (string|Function)[] = [];
		// Skin
		dimensions[4] = 'mercury';
		// LoginStatus
		dimensions[5] = 'anon';
		// IsCorporatePage
		dimensions[15] = 'No';
		Mercury.Modules.Trackers.UniversalAnalytics.setDimensions(dimensions);
	}

	function trackClick (element: HTMLElement, label: string, action = Mercury.Utils.trackActions.click): void {
		if (!element) {
			return;
		}

		element.addEventListener('click', function (): void {
			track(label, action);
		})
	}

	function trackPageView (pageType: string) {
		if (pageType) {
			track(pageType, M.trackActions.impression);
		}
	}

	function trackSubmit (form: HTMLFormElement, label: string): void {
		if (!form) {
			return;
		}

		form.addEventListener('submit', function (): void {
			track(label, M.trackActions.submit);
		});
	}

	function track (label: string, action: string) {
		M.track({
			trackingMethod: 'ga',
			action: action,
			category: 'user-login-mobile',
			label: label
		});
	}

	function setTrackingForSignInPage (): void {
		//Impression of the /signin page
		trackPageView('signin-page');
		// Click "Sign In" button
		trackSubmit(
			<HTMLFormElement> document.getElementById('loginForm'),
			'login-submit'
		);

		// Click X to "close" log-in form
		trackClick(
			<HTMLElement> document.querySelector('.close'),
			'login-modal',
			Mercury.Utils.trackActions.close
		);

		// Click "Forgot Password" link
		trackClick(
			<HTMLElement> document.querySelector('.forgotten-password'),
			'forgot-password-link'
		);

		// Click "Register Now" link
		trackClick(
			<HTMLElement> document.querySelector('.footer-callout-link'),
			'register-link'
		);
	}

	function setTrackingForRegisterPage (): void {
		//Impression of the /register page
		trackPageView('register-page');
		// Click "Sign In" button
		trackSubmit(
			<HTMLFormElement> document.getElementById('signupForm'),
			'register-submit'
		);

		// Click X to "close" log-in form
		trackClick(
			<HTMLElement> document.querySelector('.close'),
			'register-modal',
			Mercury.Utils.trackActions.close
		);

		// Click "Register Now" link
		trackClick(
			<HTMLElement> document.querySelector('.footer-callout-link'),
			'signin-link-on-register-page'
		);
	}

	function setTrackingForJoinPage(): void {
		//Impression of the /join page
		trackPageView('join-page');
		// Click "Register With Email" button
		trackClick(
			<HTMLElement> document.querySelector('.signup-provider-email'),
			'register-email-button'
		);

		// Click "Connect with Facebook" button
		trackClick(
			<HTMLElement> document.querySelector('.signup-provider-facebook'),
			'facebook-connect-button'
		);

		// Click "Sign in" link on the bottom of the page
		trackClick(
			<HTMLElement> document.querySelector('.footer-callout-link'),
			'sign-in-link'
		);

		// Click X to "close" /join page
		trackClick(
			<HTMLElement> document.querySelector('.close'),
			'join-close-button',
			Mercury.Utils.trackActions.close
		);
	}

	function init (): void {
		setTrackingDimensions();

		if (checkPageType('join-page')) {
			setTrackingForJoinPage();
		} else if (checkPageType('signin-page')) {
			setTrackingForSignInPage();
		} else if (checkPageType('register-page')){
			setTrackingForRegisterPage();
		}
	}

	document.addEventListener('DOMContentLoaded', function (): void {
		init();
	});
})();

