/**
 * Main entrypoint for validating user login
 */
class SubmitValidator {
	inputFields: NodeList;
	form: HTMLFormElement;
	submitButton: HTMLButtonElement;

	constructor(form: Element) {
		this.form = <HTMLFormElement> form;
		this.submitButton = <HTMLButtonElement> this.form.querySelector('button[type=submit]');
		this.inputFields = form.querySelectorAll('input[type=text], ' +
		'input[type=password], input[type=number], input[type=email]');
	}

	/**
	 * Activates / deactivates submit button in the login form
	 */
	private onInput ():void {
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
		return Array.prototype.every.call(this.inputFields, function (input: HTMLInputElement) {
			return input.value.length;
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
		this.onInput();
		this.form.addEventListener('input', this.onInput.bind(this));
	}
}
