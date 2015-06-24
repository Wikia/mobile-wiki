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

	function setTrackingForLoginPage (): void {
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

	function setTrackingForJoinPage(): void {
		// Click "Register With Email" button
		trackClick(
			<HTMLElement> document.querySelector('.signup-provider-email'),
			'register-email-button'
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
		if (checkPageType('join-page')) {
			setTrackingForJoinPage();
		} else if (checkPageType('login-page')) {
			setTrackingForLoginPage();
		}
	}

	init();
})();

