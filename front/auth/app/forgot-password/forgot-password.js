import AuthTracker from '../common/auth-tracker';
import AuthLogger from '../common/auth-logger';
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
export default class ForgotPassword {
	/**
	 * @param {Element} form
	 * @returns {void}
	 */
	constructor(form) {
		this.form = form;
		this.usernameInput = form.elements.username;

		this.authLogger = AuthLogger.getInstance();
		this.tracker = new AuthTracker('user-login-mobile', '/forgotPassword');
		this.urlHelper = new UrlHelper();
	}

	/**
	 * @param {Event} event
	 *
	 * @returns {void}
	 */
	onSubmit(event) {
		event.preventDefault();

		document.querySelector('.cards-container').classList.add('flipped');
		// const button = this.form.querySelector('button'),
		// 	data = {
		// 		username: this.usernameInput.value,
		// 	},
		// 	xhr = new XMLHttpRequest();
		//
		//
		// this.clearError();
		// button.disabled = true;
		//
		// /**
		//  * @returns {void}
		//  */
		// xhr.onload = () => {
		// 	button.disabled = false;
		// 	if (xhr.status === HttpCodes.UNAUTHORIZED) {
		// 		// this.tracker.track('login-credentials-error', trackActions.error);
		// 		return this.displayError('errors.wrong-credentials');
		// 	} else if (xhr.status !== HttpCodes.OK) {
		// 		// this.tracker.track('login-server-error', trackActions.error);
		// 		// this.authLogger.xhrError(xhr);
		// 		return this.displayError('errors.server-error');
		// 	}
		//
		// 	const response = JSON.parse(xhr.responseText);
		//
		// 	if (response.error) {
		// 		// Helios may return an error even if the request returns a 200
		// 		// this.tracker.track('login-credentials-error', trackActions.error);
		// 		this.displayError('errors.wrong-credentials');
		// 	} else {
		// 		this.onSuccess(response);
		// 	}
		// };
		//
		// xhr.onerror = () => {
		// 	button.disabled = false;
		// 	// this.authLogger.xhrError(xhr);
		// 	// this.tracker.track('login-server-error', trackActions.error);
		// 	this.displayError('errors.server-error');
		// };
		//
		// xhr.open('post', this.form.action, true);
		// xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		// xhr.send(this.urlHelper.urlEncode(data));
	}

	/**
	 * @param {Object} response
	 * @returns {void}
	 */
	onSuccess(response) {
		this.tracker.track('login-success', trackActions.submit);
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

