import AuthLogger from '../common/auth-logger';
import AuthTracker from '../common/auth-tracker';
import AuthUtils from '../common/auth-utils';
import FacebookSDK from './facebook-sdk';
import FormErrors from '../common/form-errors';
import HttpCodes from '../common/http-codes';
import MarketingOptIn from '../signup/marketing-opt-in';
import TermsOfUse from '../signup/terms-of-use';
import UrlHelper from '../common/url-helper';
import {trackActions} from 'common/utils/track';

/**
 * @typedef {Object} Window
 * @property {{getLoginStatus: Function, getAccessToken: Function, api: Function}} FB
 */

/**
 * @typedef {Object} FacebookUserData
 * @property {string} [email]
 */

/**
 * @typedef {Object} HeliosFacebookRegistrationData
 * @property {string} birthdate
 * @property {string} email
 * @property {string} fb_access_token
 * @property {string} password
 * @property {string} username
 * @property {string} [langCode]
 * @property {string} [marketingallowed]
 */

/**
 * @class FacebookRegistration
 *
 * @property {HTMLFormElement} form
 * @property {string} redirect
 * @property {UrlHelper} urlHelper
 * @property {MarketingOptIn} marketingOptIn
 * @property {FormErrors} formErrors
 * @property {TermsOfUse} termsOfUse
 * @property {AuthTracker} tracker
 * @property {AuthLogger} authLogger
 */
export default class FacebookRegistration {
	/**
	 * @param {HTMLFormElement} form
	 * @returns {void}
	 */
	constructor(form) {
		this.authLogger = AuthLogger.getInstance();

		new FacebookSDK(this.init.bind(this));

		this.form = form;
		this.urlHelper = new UrlHelper();

		if (window.location.search) {
			const params = this.urlHelper.urlDecode(window.location.search.substr(1));

			this.redirect = params.redirect;
		}
		this.marketingOptIn = new MarketingOptIn();
		this.marketingOptIn.init();
		this.termsOfUse = new TermsOfUse(this.form);
		this.termsOfUse.init();

		this.redirect = this.redirect || '/';
		this.formErrors = new FormErrors(this.form, 'fbRegistrationValidationErrors');

		this.form.addEventListener('submit', this.onSubmit.bind(this));
		this.tracker = new AuthTracker('user-signup-mobile', 'signup');
	}

	/**
	 * @returns {void}
	 */
	init() {
		/**
		 * @param {FacebookResponse} facebookResponse
		 * @returns {void}
		 */
		window.FB.getLoginStatus((facebookResponse) => {
			if (facebookResponse.status === 'connected') {
				this.getEmailFromFacebook();
			}
		});
	}

	/**
	 * @returns {void}
	 */
	getEmailFromFacebook() {
		window.FB.api('/me', this.setUpEmailInput.bind(this));
	}

	/**
	 * @param {FacebookUserData} facebookUserData
	 *
	 * @returns {void}
	 */
	setUpEmailInput(facebookUserData) {
		const email = facebookUserData.email,
			emailInput = this.form.elements.namedItem('email');

		if (email && emailInput) {
			const emailInputLabel = emailInput.nextElementSibling;

			emailInputLabel.classList.add('active');
			emailInput.disabled = true;
			emailInput.value = email;
		}
	}

	/**
	 * @returns {HeliosFacebookRegistrationData}
	 */
	getHeliosRegistrationDataFromForm() {
		const formElements = this.form.elements;

		return {
			username: formElements.namedItem('username').value,
			password: formElements.namedItem('password').value,
			email: formElements.namedItem('email').value,
			birthdate: formElements.namedItem('birthdate').value,
			langCode: formElements.namedItem('langCode').value,
			marketingAllowed: formElements.namedItem('marketingAllowed').value,
			registrationWikiaId: formElements.namedItem('registrationWikiaId').value
		};
	}

	/**
	 * @param {Event} event
	 *
	 * @returns {void}
	 */
	onSubmit(event) {
		event.preventDefault();

		const facebookRegistrationXhr = new XMLHttpRequest(),
			data = this.getHeliosRegistrationDataFromForm(),
			url = this.form.getAttribute('action'),
			facebookRegistrationUrl = `${url}?${this.urlHelper.urlEncode({access_token: window.FB.getAccessToken()})}`;

		this.formErrors.clearValidationErrors();

		/**
		 * @param {Event} e
		 * @returns {void}
		 */
		facebookRegistrationXhr.onload = (e) => {
			const status = e.target.status;

			if (status === HttpCodes.OK) {
				this.tracker.track('facebook-signup-join-wikia-success', trackActions.success);
				AuthUtils.authSuccessCallback(this.redirect);
			} else if (status === HttpCodes.BAD_REQUEST) {
				this.formErrors.displayValidationErrors(JSON.parse(facebookRegistrationXhr.responseText).errors);
			} else {
				this.formErrors.displayGeneralError();
				this.authLogger.xhrError(facebookRegistrationXhr);
			}
		};

		/**
		 * @returns {void}
		 */
		facebookRegistrationXhr.onerror = () => {
			this.formErrors.displayGeneralError();
			this.authLogger.xhrError(facebookRegistrationXhr);

			this.tracker.track('facebook-signup-join-wikia-error', trackActions.error);
		};

		facebookRegistrationXhr.open('POST', facebookRegistrationUrl, true);
		facebookRegistrationXhr.withCredentials = true;
		facebookRegistrationXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		facebookRegistrationXhr.send(this.urlHelper.urlEncode(data));
	}

	/**
	 * @returns {void}
	 */
	watch() {
		this.tracker.trackCloseWindow();
	}
}
