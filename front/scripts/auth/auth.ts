/**
 * Main entrypoint for validating user login
 */
class LoginValidator {
	loginUsername: HTMLInputElement;
	loginPassword: HTMLInputElement;
	loginSubmit: HTMLButtonElement;

	constructor() {
		this.loginUsername = <HTMLInputElement> window.document.querySelector('#loginUsername');
		this.loginPassword = <HTMLInputElement> window.document.querySelector('#loginPassword');
		this.loginSubmit = <HTMLButtonElement> window.document.querySelector('#loginSubmit');
		this.onInput();
		window.document.querySelector('#loginForm').addEventListener('input', this.onInput);
	}

	/**
	 * Activates / deactivates submit button in the login form
	 */
	onInput = ():void => {
		if (this.isNotEmpty()) {
			this.activateSubmit();
		} else {
			this.deactivateSubmit();
		}
	};

	/**
	 * Checks if both username and password fields are not empty
	 * @returns {boolean}
	 */
	isNotEmpty = ():boolean => {
		return !!(this.loginUsername.value.length && this.loginPassword.value.length);
	};

	activateSubmit = ():void => {
		this.loginSubmit.disabled = false;
	};

	deactivateSubmit = ():void => {
		this.loginSubmit.disabled = true;
	}
}

window.document.addEventListener('DOMContentLoaded', function ():void {
	var loginValidator = new LoginValidator();
});
