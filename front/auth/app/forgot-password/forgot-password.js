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
	}

	/**
	 * @protected
	 *
	 * @returns {object} data to be send
	 */
	collectDataBeforeSubmit() {
		return {
			username: this.form.elements.username.value,
			redirect: this.redirect || ''
		};
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

