import AuthTracker from '../common/auth-tracker';
import AuthLogger from '../common/auth-logger';
import HttpCodes from '../common/http-codes';
import UrlHelper from '../common/url-helper';
import {track as mercuryTrack, trackActions} from 'common/utils/track';

/**
 * @typedef {Object} FormElements
 * @property {HTMLInputElement} username
 */

/**
 * @class Login
 *
 * @property {HTMLFormElement} form
 * @property {string} redirect
 * @property {HTMLInputElement} usernameInput
 * @property {UrlHelper} urlHelper
 * @property {AuthTracker} tracker
 * @property {AuthLogger} authLogger
 */
export default class ForgotPassword {
	/**
	 * @param {Element} form
	 * @returns {void}
	 */
	constructor(form) {
		this.form = form;
		this.usernameInput = form.elements.username;

		this.authLogger = AuthLogger.getInstance();
		this.tracker = new AuthTracker('forgot-password-mobile', '/forgotPassword');
		this.urlHelper = new UrlHelper();
		this.redirect = this.extractRedirectUrlFromQuery();
	}

	/**
	 * @private
	 */
	extractRedirectUrlFromQuery() {
		let redirect = '';

		if (window.location.search) {
			const params = this.urlHelper.urlDecode(window.location.search.substr(1));
			redirect = params.redirect;
		}

		return redirect;
	}

	/**
	 * @param {Event} event
	 *
	 * @returns {void}
	 */
	onSubmit(event) {
		event.preventDefault();

		const button = this.form.querySelector('button'),
			data = {
				username: this.usernameInput.value,
				redirect: this.redirect
			},
			xhr = new XMLHttpRequest();


		this.clearError();
		button.disabled = true;

		xhr.onload = () => {
			button.disabled = false;

			if (xhr.status === HttpCodes.NOT_FOUND) {
				this.tracker.track('username-not-recognized', trackActions.error);
				this.displayError('errors.username-not-recognized');
			} else if (xhr.status === HttpCodes.TOO_MANY_REQUESTS) {
				this.tracker.track('reset-password-email-sent', trackActions.error);
				this.displayError('errors.reset-password-email-sent');
			} else if (xhr.status !== HttpCodes.OK) {
				this.onError(xhr);
			} else {
				this.onSuccess();
			}
		};

		xhr.onerror = () => {
			button.disabled = false;
			this.oneError(xhr);
		};

		xhr.open('post', this.form.action, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.send(this.urlHelper.urlEncode(data));
	}

	onError(xhr) {
		this.authLogger.xhrError(xhr);
		this.tracker.track('server-error', trackActions.error);
		this.displayError('errors.server-error');
	}

	/**
	 * @returns {void}
	 */
	onSuccess() {
		this.tracker.track('forgot-password-success', trackActions.submit);
		document.querySelector('.cards-container').classList.add('dissolved');
	}

	/**
	 * @returns {void}
	 */
	watch() {
		this.tracker.trackCloseWindow();
		this.form.addEventListener('submit', this.onSubmit.bind(this));
	}

	/**
	 * @param {string} messageKey
	 *
	 * @returns {void}
	 */
	displayError(messageKey) {
		const errorElement = document.createElement('small');

		errorElement.classList.add('error');
		errorElement.innerHTML = i18n.t(messageKey);
		this.usernameInput.parentElement.appendChild(errorElement);
	}

	/**
	 * @returns {void}
	 */
	clearError() {
		const errorNode = this.form.querySelector('small.error');

		if (errorNode) {
			errorNode.parentNode.removeChild(errorNode);
		}
	}
}

