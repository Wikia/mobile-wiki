/**
 * Main entry point for validating user login
 * @class LoginValidator
 *
 * @property {HTMLInputElement} loginUsername
 * @property {HTMLInputElement} loginPassword
 * @property {HTMLButtonElement} loginSubmit
 */
export default class LoginValidator {
	/**
	 * @returns {void}
	 */
	constructor() {
		this.loginUsername = window.document.getElementById('loginUsername');
		this.loginPassword = window.document.getElementById('loginPassword');
		this.loginSubmit = window.document.getElementById('loginSubmit');
	}

	/**
	 * Activates / deactivates submit button in the login form
	 *
	 * @returns {void}
	 */
	onInput() {
		if (this.isNotEmpty()) {
			this.activateSubmit();
		} else {
			this.deactivateSubmit();
		}
	}

	/**
	 * Checks if both username and password fields are not empty
	 *
	 * @returns {boolean}
	 */
	isNotEmpty() {
		return Boolean(this.loginUsername.value.length && this.loginPassword.value.length);
	}

	/**
	 * @returns {void}
	 */
	activateSubmit() {
		this.loginSubmit.disabled = false;
	}

	/**
	 * @returns {void}
	 */
	deactivateSubmit() {
		this.loginSubmit.disabled = true;
	}

	/**
	 * Starts continuous checking for new input
	 *
	 * @returns {void}
	 */
	watch() {
		this.onInput();
		window.document.getElementById('loginForm')
			.addEventListener('input', this.onInput.bind(this));
	}
}
