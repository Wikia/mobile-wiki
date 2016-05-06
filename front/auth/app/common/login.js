import AuthTracker from '../common/auth-tracker';
import AuthLogger from '../common/auth-logger';
import AuthUtils from '../common/auth-utils';
import HttpCodes from '../common/http-codes';
import UrlHelper from '../common/url-helper';
import {trackActions} from 'common/utils/track';

/**
 * @typedef {Object} LoginCredentials
 * @property {string} username
 * @property {string} password
 */

/**
 * @typedef {Object} LoginResponse
 * @property {string} user_id
 * @property {string} access_token
 * @property {string} refresh_token
 * @property {string} token_type
 * @property {string} expires_in
 * @property {string} [error]
 * @property {string} [error_description]
 */

/**
 * @typedef {Object} FormElements
 * @property {HTMLInputElement} username
 * @property {HTMLInputElement} password
 */

/**
 * @class Login
 *
 * @property {HTMLFormElement} form
 * @property {string} redirect
 * @property {HTMLInputElement} usernameInput
 * @property {HTMLInputElement} passwordInput
 * @property {UrlHelper} urlHelper
 * @property {AuthTracker} tracker
 * @property {AuthLogger} authLogger
 */
export default class Login {
	/**
	 * @param {Element} form
	 * @returns {void}
	 */
	constructor(form) {
		this.authLogger = AuthLogger.getInstance();
		this.form = form;

		this.usernameInput = form.elements.username;
		this.passwordInput = form.elements.password;
		this.urlHelper = new UrlHelper();

		if (window.location.search) {
			const params = this.urlHelper.urlDecode(window.location.search.substr(1));

			this.redirect = params.redirect;
		}
		this.redirect = this.redirect || '/';
		this.tracker = new AuthTracker('user-login-mobile', '/signin');
	}

	/**
	 * @param {Event} event
	 *
	 * @returns {void}
	 */
	onSubmit(event) {
		const xhr = new XMLHttpRequest(),
			postData = this.getCredentials(),
			submitButton = this.form.querySelector('button'),
			enableSubmitButton = () => {
				submitButton.disabled = false;
				submitButton.classList.remove('on');
			};

		event.preventDefault();
		this.clearError();
		submitButton.disabled = true;
		submitButton.classList.add('on');

		/**
		 * @returns {void}
		 */
		xhr.onload = () => {
			enableSubmitButton();
			if (xhr.status === HttpCodes.UNAUTHORIZED) {
				this.tracker.track('login-credentials-error', trackActions.error);
				return this.displayError('errors.wrong-credentials');
			} else if (xhr.status !== HttpCodes.OK) {
				this.tracker.track('login-server-error', trackActions.error);
				this.authLogger.xhrError(xhr);
				return this.displayError('errors.server-error');
			}

			const response = JSON.parse(xhr.responseText);

			if (response.error) {
				// Helios may return an error even if the request returns a 200
				this.tracker.track('login-credentials-error', trackActions.error);
				this.displayError('errors.wrong-credentials');
			} else {
				this.onLoginSuccess(response);
			}
		};

		xhr.onerror = () => {
			enableSubmitButton();
			this.authLogger.xhrError(xhr);
			this.tracker.track('login-server-error', trackActions.error);
			this.displayError('errors.server-error');
		};

		xhr.open('post', this.form.action, true);
		xhr.withCredentials = true;
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.send(this.urlHelper.urlEncode(postData));
	}

	/**
	 * @param {Object} response
	 * @returns {void}
	 */
	onLoginSuccess(response) {
		this.tracker.track('login-success', trackActions.submit);
		AuthUtils.authSuccessCallback(this.redirect, response.user_id);
	}

	/**
	 * @returns {void}
	 */
	watch() {
		this.tracker.trackCloseWindow();
		this.form.addEventListener('submit', this.onSubmit.bind(this));

		// TODO remove when SOC-719 is ready
		if (pageParams.isModal) {
			this.form.querySelector('.forgotten-password').addEventListener('click', (event) => {
				AuthUtils.loadUrl(event.target.href);
				event.preventDefault();
			});
		}
	}

	/**
	 * @returns {LoginCredentials}
	 */
	getCredentials() {
		return {
			username: this.usernameInput.value,
			password: this.passwordInput.value
		};
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
		this.form.appendChild(errorElement);
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

