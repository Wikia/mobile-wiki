import AuthUtils from '../common/auth-utils';
import HttpCodes from '../common/http-codes';
import PasswordForm from '../common/password-form';
import {trackActions} from 'common/utils/track';

export default class ForgotPassword extends PasswordForm {

	/**
	 * @param {Element} form
	 */
	constructor(form) {
		super(form, {
			category: 'forgot-password-mobile',
			pageType: '/forgotPassword'
		});
	}

	/**
	 * @protected
	 *
	 * @param {array} parameters
	 */
	extractFieldsFromPathParameters(parameters) {
		this.redirect = parameters.redirect;

		if (parameters.username) {
			const usernameInput = this.form.elements.username;

			usernameInput.focus();
			usernameInput.value = parameters.username;
		}
	}

	/**
	 * @protected
	 *
	 * @returns {object} data to be send
	 */
	collectDataBeforeSubmit() {
		return {
			username: this.form.elements.username.value,
			redirect: this.redirect
		};
	}


	/**
	 * @protected
	 *
	 * @param {XMLHttpRequest} xhr
	 * @param {object} response - parsed json response
	 *
	 * @returns {boolean} - true if errors were handled, false otherwise
	 */
	handleCustomErrors(xhr, response) {
		let errorsHandled = response.step === 'reset-password';

		if (errorsHandled) {
			this.handleResetPasswordErrors(xhr, response);
		}

		return errorsHandled;
	}

	handleResetPasswordErrors(xhr, response) {
		if (xhr.status === HttpCodes.BAD_REQUEST) {
			if (this.hasError(response)) {
				response.errors.map(this.toErrorHandler)
					.filter(this.unique)
					.forEach(errorHandler => {
						errorHandler(xhr);
					});
			}
		} else if (xhr.status === HttpCodes.TOO_MANY_REQUESTS) {
			this.tracker.track('reset-password-email-sent', trackActions.error);
			this.displayError('errors.reset-password-email-sent');
		} else {
			this.onError(xhr);
		}
	}

	hasError(response) {
		return response && response.errors && response.errors.length;
	}

	toErrorHandler(error) {
		let errorHandler = this.onError;

		if (error.description === 'user_is_blocked') {
			errorHandler = this.onUsernameBlockedError;
		} else if (error.description === 'user_doesnt_exist') {
			errorHandler = this.onUsernameNotRecognizedError;
		}

		return errorHandler;
	}

	unique(value, index, array) {
		return array.indexOf(value) === index;
	}

	onUsernameBlockedError() {
		this.tracker.track('username_blocked', trackActions.error);
		this.displayError('errors.username_blocked');
	}

	/**
	 * @protected
	 *
	 * @returns {void}
	 */
	onInit() {
		document.querySelector('.forgot-password-check-email-link').addEventListener('click', event => {
			AuthUtils.loadUrl(event.target.href);
			event.preventDefault();
		});
	}
}

