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
export default class ResetPassword {
	/**
	 * @param {Element} form
	 * @returns {void}
	 */
	constructor(form) {
		this.form = form;
		this.newPasswordInput = form.elements.newPassword;
		this.confirmNewPasswordInput = form.elements.confirmNewPassword;

		this.authLogger = AuthLogger.getInstance();
		this.tracker = new AuthTracker('reset-password-mobile', '/resetPassword');
		this.urlHelper = new UrlHelper();

		this.extractParametersFromUrlQuery();
	}

	/**
	 * @private
	 */
	extractParametersFromUrlQuery() {
		if (window.location.search) {
			const params = this.urlHelper.urlDecode(window.location.search.substr(1));
			this.redirect = params.redirect;
			this.token = params.token;
			this.username = params.username;
		}
	}

	/**
	 * @param {Event} event
	 *
	 * @returns {void}
	 */
	onSubmit(event) {
		event.preventDefault();

		const button = this.form.querySelector('button'),
			newPasswordValue = this.newPasswordInput.value,
			confirmNewPasswordValue = this.confirmNewPasswordInput.value,
			data = {
				password: newPasswordValue,
				redirect: this.redirect,
				username: this.username
			},
			xhr = new XMLHttpRequest();

		this.clearError();
		button.disabled = true;

		if (newPasswordValue !== confirmNewPasswordValue) {
			this.displayError('errors.passwords_not_match');
		} else {
			xhr.onload = () => {
				button.disabled = false;

				if (xhr.status === HttpCodes.OK) {
					this.onSuccess();
				} else {
					this.handleErrors(xhr);
				}
			};

			xhr.onerror = () => {
				button.disabled = false;
				this.onError(xhr);
			};

			xhr.open('post', this.form.action, true);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.send(this.urlHelper.urlEncode(data));
		}
	}

	handleErrors(xhr) {
		const response = JSON.parse(xhr.responseText);

		if (response.step === 'service-discovery') {
			this.onError(xhr);
		} else if (response.step === 'user-discovery') {
			this.handleUserDiscoveryErrors(xhr);
		} else if (response.step === 'update-password') {
			this.handleUpdatePasswordErrors(xhr, response);
		} else {
			this.onError(xhr);
		}
	}

	handleUserDiscoveryErrors(xhr) {
		if (xhr.status === HttpCodes.NOT_FOUND) {
			this.onUsernameNotRecognizedError();
		} else {
			this.onError(xhr);
		}
	}

	handleUpdatePasswordErrors(xhr, response) {
		if (xhr.status === HttpCodes.BAD_REQUEST) {
			if (this.hasError(response.errors)) {
				if (response.errors[0].description === 'password-name-match') {
					this.tracker.track('password_equal_name', trackActions.error);
					this.displayError('errors.password_equal_name');
				} else {
					this.onError(xhr);
				}
			}
		} else if (xhr.status === HttpCodes.FORBIDDEN) {
			// invalid token
		} else if (xhr.status !== HttpCodes.OK) {
			this.onError(xhr);
		}
	}

	hasError(response) {
		return response && response.errors && response.errors.length;
	}

	onError(xhr) {
		this.authLogger.xhrError(xhr);
		this.tracker.track('server-error', trackActions.error);
		this.displayError('errors.server-error');
	}

	onUsernameNotRecognizedError() {
		this.tracker.track('username-not-recognized', trackActions.error);
		this.displayError('errors.username-not-recognized');
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
		this.newPasswordInput.parentElement.appendChild(errorElement);
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

