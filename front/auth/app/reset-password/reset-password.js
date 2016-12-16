import HttpCodes from '../common/http-codes';
import PasswordForm from '../common/password-form';
import {trackActions} from 'common/utils/track';

export default class ResetPassword extends PasswordForm {

	/**
	 * @param {Element} form
	 */
	constructor(form) {
		super(form, {
			category: 'reset-password-mobile',
			pageType: '/resetPassword'
		});
	}

	/**
	 * @protected
	 *
	 * @param {array} parameters
	 */
	extractFieldsFromPathParameters(parameters) {
		this.redirect = parameters.redirect;
		this.token = parameters.token;
		this.username = parameters.username;
	}


	/**
	 * @protected
	 *
	 * @returns {object} data to be send
	 */
	collectDataBeforeSubmit() {
		return {
			password: this.form.elements.newPassword.value,
			redirect: this.redirect,
			username: this.username
		};
	}

	/**
	 * @protected
	 *
	 * @returns {boolean} true if input is validated, false if errors were found
	 */
	inputIsValid() {
		const newPasswordValue = this.form.elements.newPassword.value,
			confirmNewPasswordValue = this.form.elements.confirmNewPassword.value,
			passwordIsSame = newPasswordValue === confirmNewPasswordValue;

		if (!passwordIsSame) {
			this.displayError('errors.passwords_not_match');
		}

		return passwordIsSame;
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
		let errorsHandled = response.step === 'update-password';

		if (errorsHandled) {
			this.handleUpdatePasswordErrors(xhr, response);
		}

		return errorsHandled;
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
}

