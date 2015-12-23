/**
 * Main entry point for validating user login
 * @class SubmitValidator
 *
 * @property {HTMLFormElement} form
 * @property {HTMLButtonElement} submitButton
 * @property {boolean} isPermanentlyDisabled
 */
export default class SubmitValidator {
	/**
	 * @param {Element} form
	 * @returns {void}
	 */
	constructor(form) {
		this.form = form;
		this.submitButton = this.form.querySelector('button[type=submit]');
		this.isPermanentlyDisabled = false;
	}

	/**
	 * Activates / deactivates submit button in the login form
	 *
	 * @returns {void}
	 */
	onChange() {
		if (this.areAllFieldsFilled() && !this.isPermanentlyDisabled) {
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
	areAllFieldsFilled() {
		const inputFields = this.form.querySelectorAll('input[type=text], ' +
			'input[type=password], input[type=number], input[type=email], input[type=checkbox]:required');

		/**
		 * @param {HTMLInputElement} input
		 * @returns {boolean}
		 */
		return Array.prototype.slice.call(inputFields, 0).every((input) => {
			return input.value && !(input.type === 'checkbox' && !input.checked);
		});
	}

	/**
	 * @returns {void}
	 */
	activateSubmit() {
		this.submitButton.disabled = false;
	}

	/**
	 * @returns {void}
	 */
	deactivateSubmit() {
		this.submitButton.disabled = true;
	}

	/**
	 * @returns {void}
	 */
	disablePermanently() {
		this.isPermanentlyDisabled = true;
		this.deactivateSubmit();
	}

	/**
	 * Starts continuous checking for new input
	 *
	 * @returns {void}
	 */
	watch() {
		this.onChange();
		this.form.addEventListener('change', this.onChange.bind(this), true);
		this.form.addEventListener('input', this.onChange.bind(this));
	}
}
