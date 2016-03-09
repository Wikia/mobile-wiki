import AuthTracker from '../common/AuthTracker';
import AuthLogger from '../common/AuthLogger';
import AuthUtils from '../common/AuthUtils';
import Cookie from '../common/Cookie';
import FormErrors from '../common/FormErrors';
import HttpCodes from '../common/HttpCodes';
import UrlHelper from '../common/UrlHelper';
import VisitSourceWrapper from '../common/VisitSourceWrapper';
import MarketingOptIn from '../signup/MarketingOptIn';
import TermsOfUse from '../signup/TermsOfUse';
import {track as mercuryTrack, trackActions} from 'common/utils/track';

/**
 * @typedef {Object} HeliosError
 * @property {HeliosErrorAdditional} additional
 * @property {string} description
 */

/**
 * @typedef {Object} HeliosErrorAdditional
 * @property {string} field
 */

/**
 * @typedef {Object} HeliosRegisterInput
 * @property {string} birthdate
 * @property {string} email
 * @property {string} langCode
 * @property {string} password
 * @property {string} username
 * @property {string} [marketingallowed]
 */

/**
 * Creates new Signup Form.
 * @class SignupForm
 *
 * @property {HTMLFormElement} form
 * @property {string} redirect
 * @property {MarketingOptIn} marketingOptIn
 * @property {FormErrors} formErrors
 * @property {string} pageName
 * @property {TermsOfUse} termsOfUse
 * @property {AuthTracker} tracker
 * @property {AuthLogger} authLogger
 */
export default class SignupForm {
	/**
	 * @param {Element} form
	 * @returns {void}
	 */
	constructor(form) {
		this.pageName = 'signup';

		this.form = form;
		if (window.location.search) {
			const params = (new UrlHelper()).urlDecode(window.location.search.substr(1));

			this.redirect = params.redirect;
		}
		this.redirect = this.redirect || '/';
		this.marketingOptIn = new MarketingOptIn();
		this.termsOfUse = new TermsOfUse(this.form);
		this.marketingOptIn.init();
		this.formErrors = new FormErrors(this.form, 'registrationValidationErrors', this.pageName);
		this.termsOfUse.init();
		this.tracker = new AuthTracker('user-signup-mobile', this.pageName);
		this.authLogger = AuthLogger.getInstance();
	}

	/**
	 * @returns {HeliosRegisterInput}
	 */
	getFormValues() {
		const formElements = this.form.elements;

		return {
			username: formElements.namedItem('username').value,
			password: formElements.namedItem('password').value,
			email: formElements.namedItem('email').value,
			birthdate: formElements.namedItem('birthdate').value,
			langCode: formElements.namedItem('langCode').value,
			marketingallowed: formElements.namedItem('marketingallowed').value
		};
	}

	/**
	 * @returns {string}
	 */
	getWikiaDomain() {
		const hostParts = location.host.split('.').reverse();

		if (hostParts.length >= 2) {
			return `${hostParts[1]}.${hostParts[0]}`;
		}
		return location.host;
	}

	/**
	 * @param {string} userId
	 * @returns {void}
	 */
	onSuccessfulRegistration(userId) {
		M.provide('userId', userId);
		this.tracker.track('successful-registration', trackActions.success);

		Cookie.set(
			'registerSuccess',
			'1',
			{
				domain: this.getWikiaDomain()
			}
		);

		mercuryTrack({
			trackingMethod: 'internal',
			action: trackActions.success,
			category: 'user-registration-session-source',
			label: VisitSourceWrapper.sessionVisitSource.get()
		});

		mercuryTrack({
			trackingMethod: 'internal',
			action: trackActions.success,
			category: 'user-registration-lifetime-source',
			label: VisitSourceWrapper.lifetimeVisitSource.get()
		});

		AuthUtils.authSuccessCallback(this.redirect);
	}

	/**
	 * @param {Event} event
	 * @returns {void}
	 */
	onSubmit(event) {
		const registrationXhr = new XMLHttpRequest(),
			data = this.getFormValues(),
			submitButton = this.form.querySelector('button'),
			enableSubmitButton = () => {
				submitButton.disabled = false;
				submitButton.classList.remove('on');
			};

		submitButton.disabled = true;
		submitButton.classList.add('on');
		this.formErrors.clearValidationErrors();

		/**
		 * @param {Event} e
		 * @returns {void}
		 */
		registrationXhr.onload = (e) => {
			const status = e.target.status;

			if (status === HttpCodes.OK) {
				this.onSuccessfulRegistration(JSON.parse(registrationXhr.responseText).user_id);
			} else if (status === HttpCodes.BAD_REQUEST) {
				enableSubmitButton();
				this.formErrors.displayValidationErrors(JSON.parse(registrationXhr.responseText).errors);
			} else {
				enableSubmitButton();
				this.formErrors.displayGeneralError();
				this.authLogger.xhrError(registrationXhr);
			}
		};

		registrationXhr.onerror = () => {
			enableSubmitButton();
			this.formErrors.displayGeneralError();
			this.authLogger.xhrError(registrationXhr);
		};

		registrationXhr.open('POST', this.form.action, true);
		registrationXhr.withCredentials = true;
		registrationXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		registrationXhr.send((new UrlHelper()).urlEncode(data));

		event.preventDefault();
	}

	/**
	 * @returns {void}
	 */
	watch() {
		this.form.addEventListener('submit', this.onSubmit.bind(this));
	}
}
