import AuthTracker from './common/auth-tracker';
import {trackActions} from 'common/utils/track';

/**
 * @returns {void}
 */
function setTrackingForSignInPage() {
	const gaCategory = (pageParams.windowOrigin ? 'force-login-window' : 'user-login-mobile'),
		tracker = new AuthTracker(gaCategory, '/signin');

	// Impression of the Signin page
	tracker.trackPageView();

	// Click "Sign In" button
	tracker.trackSubmit(
		document.getElementById('loginForm'),
		'login-submit'
	);

	// Click "Register Now" link
	tracker.trackClick(
		document.querySelector('.footer-callout-link'),
		'register-link'
	);

	// Click "Forgot Password" link
	tracker.trackClick(
		document.querySelector('.forgotten-password'),
		'forgot-password-link'
	);

	tracker.trackClick(
		document.querySelector('.signup-provider-facebook'),
		'facebook-connect'
	);
}

/**
 * @returns {void}
 */
function setTrackingForRegisterPage() {
	const gaCategory = (pageParams.windowOrigin ? 'force-login-window' : 'user-signup-mobile'),
		tracker = new AuthTracker(gaCategory, '/register');

	// Impression of the Register page
	tracker.trackPageView();

	// Click "Sign In" button
	tracker.trackSubmit(
		document.getElementById('signupForm'),
		'register-submit'
	);

	// Click "Register Now" link
	tracker.trackClick(
		document.querySelector('.footer-callout-link'),
		'signin-link-on-register-page'
	);

	if (pageParams.windowOrigin) {
		tracker = new AuthTracker('force-login-modal', '/register');
	}

	// Click on 'connect with facebook'
	tracker.trackClick(
		document.querySelector('.signup-provider-facebook'),
		'facebook-connect'
	);
}

/**
 * @returns {void}
 */
function setTrackingForJoinPage() {
	const gaCategory = (pageParams.windowOrigin ? 'force-login-window' : 'user-login-mobile'),
		tracker = new AuthTracker(gaCategory, '/join');

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
}

/**
 * @returns {void}
 */
function setTrackingForFBConnectPage() {
	const gaCategory = (pageParams.windowOrigin ? 'force-login-window' : 'user-login-mobile'),
		tracker = new AuthTracker(gaCategory, '/signin');

	// Impression of the Facebook Connect page
	tracker.trackPageView();

	// Click "Connect" button
	tracker.trackSubmit(
		document.getElementById('facebookConnectForm'),
		'facebook-connect-submit'
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
	const gaCategory = (pageParams.windowOrigin ? 'force-login-modal' : 'user-signup-mobile'),
		tracker = new AuthTracker(gaCategory, '/register');

	// Impression of the Facebook Register page
	tracker.trackPageView();

	// Click "Register" button
	tracker.trackSubmit(
		document.getElementById('facebookRegistrationForm'),
		'facebook-register-submit'
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
export function init() {
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
