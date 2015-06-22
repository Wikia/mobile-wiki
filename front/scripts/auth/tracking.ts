/// <reference path='../baseline/mercury.ts' />
/// <reference path='../mercury/utils/track.ts' />

(function () {
	document.addEventListener('DOMContentLoaded', (): void => {
		setTrackingDimensions();

		if (document.querySelector('small.error') !== null) {
			// An error occurred while logging in
			Mercury.Utils.track({
				trackingMethod: 'ga',
				action: Mercury.Utils.trackActions.error,
				category: 'user-login-mobile',
				label: 'login'
			});
		}
	});

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

	// Click "Sign In" button
	document.getElementById('loginSubmit').addEventListener('click', (): void => {
		Mercury.Utils.track({
			trackingMethod: 'ga',
			action: Mercury.Utils.trackActions.click,
			category: 'user-login-mobile',
			label: 'login-submit'
		});
	});

	// Click X to "close" log-in form
	document.querySelector('.close').addEventListener('click', (): void => {
		Mercury.Utils.track({
			trackingMethod: 'ga',
			action: Mercury.Utils.trackActions.close,
			category: 'user-login-mobile',
			label: 'login-modal'
		});
	});

	// Click "Forgot Password" link
	document.querySelector('.forgotten-password').addEventListener('click', (): void => {
		Mercury.Utils.track({
			trackingMethod: 'ga',
			action: Mercury.Utils.trackActions.click,
			category: 'user-login-mobile',
			label: 'forgot-password-link'
		});
	});

	// Click "Register Now" link
	document.querySelector('.footer-callout-link').addEventListener('click', (): void => {
		M.track({
			trackingMethod: 'ga',
			action: M.trackActions.click,
			category: 'user-login-mobile',
			label: 'register-link'
		});
	});
})();

