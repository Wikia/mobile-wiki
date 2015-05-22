/// <reference path='../baseline/mercury.ts' />
/// <reference path='../mercury/utils/track.ts' />

window.document.addEventListener('DOMContentLoaded', function ():void {
	var formElement = window.document.querySelector('form');
	new Form(formElement).watch();
	new SubmitValidator(formElement).watch();

	var UA = Mercury.Modules.Trackers.UniversalAnalytics,
		dimensions: (string|Function)[] = [];

	dimensions[4] = 'mercury'; // Skin
	dimensions[5] = 'anon';    // LoginStatus
	dimensions[15] = 'No';     // IsCorporatePage

	UA.setDimensions(dimensions);

	if (window.document.querySelector('small.error') !== null) {
		// An error occurred while logging in
		Mercury.Utils.track({
			trackingMethod: 'ga',
			action: Mercury.Utils.trackActions.error,
			category: 'user-login-mobile',
			label: 'login'
		});
	}
});

// Event Tracking

// Click "Sign In" button
window.document.querySelector('#loginSubmit').addEventListener('click', function (): void {
	Mercury.Utils.track({
		trackingMethod: 'ga',
		action: Mercury.Utils.trackActions.click,
		category: 'user-login-mobile',
		label: 'login-submit'
	});
});

// Click X to "close" log-in form
window.document.querySelector('a.close').addEventListener('click', function (): void {
	Mercury.Utils.track({
		trackingMethod: 'ga',
		action: Mercury.Utils.trackActions.close,
		category: 'user-login-mobile',
		label: 'login-modal'
	});
});

// Click "Forgot Password" link
window.document.querySelector('a.forgotten-password').addEventListener('click', function (): void {
	Mercury.Utils.track({
		trackingMethod: 'ga',
		action: Mercury.Utils.trackActions.click,
		category: 'user-login-mobile',
		label: 'forgot-password-link'
	});
});

// Click "Register Now" link
window.document.querySelector('footer .footer-callout-link').addEventListener('click', function (): void {
	M.track({
		trackingMethod: 'ga',
		action: M.trackActions.click,
		category: 'user-login-mobile',
		label: 'register-link'
	});
});

