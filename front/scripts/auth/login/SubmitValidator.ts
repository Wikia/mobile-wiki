/**
 * Main entrypoint for validating user login
 */
class SubmitValidator {
	form: HTMLFormElement;
	submitButton: HTMLButtonElement;

	constructor(form: Element) {
		this.form = <HTMLFormElement> form;
		this.submitButton = <HTMLButtonElement> this.form.querySelector('button[type=submit]');
	}

	/**
	 * Activates / deactivates submit button in the login form
	 */
	private onChange ():void {
		if (this.areAllFieldsFilled()) {
			this.activateSubmit();
		} else {
			this.deactivateSubmit();
		}
	}

	/**
	 * Checks if both username and password fields are not empty
	 * @returns {boolean}
	 */
	private areAllFieldsFilled ():boolean {
		var i: number,
			input: HTMLInputElement,
			inputFields: NodeList = this.form.querySelectorAll('input[type=text], ' +
			'input[type=password], input[type=number], input[type=email], input[type=checkbox]:required');

		return Array.prototype.slice.call(inputFields, 0).every((input: HTMLInputElement): boolean => {
			return input.value && !(input.type === 'checkbox' && !input.checked);
		});
	}


	private activateSubmit ():void {
		this.submitButton.disabled = false;
	}

	private deactivateSubmit ():void {
		this.submitButton.disabled = true;
	}

	/**
	 * Starts continuous checking for new input
	 */
	public watch (): void {
		this.onChange();
		this.form.addEventListener('change', this.onChange.bind(this), true);
		this.form.addEventListener('input', this.onChange.bind(this));
	}
}
