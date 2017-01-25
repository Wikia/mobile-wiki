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
			pageType: '/reset-password'
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
		// App encodes spaces using + character and it's not decoded using decodeUriComponent
		this.username = parameters.username.replace(/\+/g, ' ');
	}

	/**
	 * @protected
	 *
	 * @returns {object} data to be send
	 */
	collectDataBeforeSubmit() {
		return {
			password: this.form.elements.newPassword.value,
			token: this.token,
			username: this.username
		};
	}

	/**
	 * @protected
	 *
	 * @returns {boolean} true if input is validated, false if errors were found
	 */
	isInputValid() {
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
	 * @param xhr
	 */
	handleErrors(xhr) {
		try {
			const response = JSON.parse(xhr.responseText);

			if (xhr.status === HttpCodes.FORBIDDEN) {
				if (this.form.dataset.tokenExpiryRedirect) {
					window.location.href = this.form.dataset.tokenExpiryRedirect;
				}
			} else {
				response.errors.forEach(error => {
					this.tracker.track(error, trackActions.error);
					this.displayError(`errors.${error}`);
				});
			}
		} catch (e) {
			this.onError(xhr);
		}
	}
}
