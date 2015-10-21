/**
 * Controls floating labels behavior on focus / blur events in input fields
 * @class Form
 */
class Form {
	form: HTMLFormElement;
	inputs: NodeList;

	/**
	 * @constructs Form
	 * @param {Element} form
	 */
	constructor (form: Element) {
		this.form = <HTMLFormElement> form;
		this.inputs = this.form.querySelectorAll('input[type=text], input[type=password], input[type=email]');
	}

	/**
	 * @param {Event} event
	 *
	 * @returns {undefined}
	 */
	private onFocus (event: Event): void {
		var input: HTMLInputElement = <HTMLInputElement> event.target,
			wrapper: HTMLElement,
			label: HTMLElement;

		if (['checkbox', 'submit'].indexOf(input.type) !== -1) {
			return;
		}

		wrapper = <HTMLElement> this.findWrapper(input);
		label = <HTMLElement> this.findLabel(wrapper);

		if (input.tagName.toLowerCase() === 'input' && wrapper) {
			label.classList.add('active');
		}
	}

	/**
	 * @param {Event} event
	 *
	 * @returns {undefined}
	 */
	private onBlur (event: Event): void {
		Array.prototype.forEach.call(
			this.inputs,
			(function (input: HTMLInputElement): void {
				var wrapper: HTMLElement = this.findWrapper(input),
					label: HTMLElement = this.findLabel(wrapper);
				if (!input.classList.contains('fake-input') && input.id !== 'signupBirthDate' &&
					wrapper && input.value === '') {
					label.classList.remove('active');
				}
			}).bind(this)
		);
	}

	/**
	 * @param {HTMLInputElement} input
	 * @param {HTMLElement} toggler
	 *
	 * @returns {undefined}
	 */
	private togglePasswordInput (input: HTMLInputElement, toggler: HTMLElement): void {
		if (input.type === 'password') {
			input.type = 'text';
			toggler.classList.add('on');
		} else {
			input.type = 'password';
			toggler.classList.remove('on');
		}
		input.focus();
	}

	/**
	 * @param {Event} event
	 *
	 * @returns {undefined}
	 */
	private onClick (event: Event): void {
		var element: HTMLInputElement = <HTMLInputElement> event.target,
			wrapper: HTMLElement,
			input: HTMLInputElement;
		if (element.className.match('password-toggler')) {
			wrapper = <HTMLElement> element.parentElement;
			input = <HTMLInputElement> wrapper.querySelector('input');
			this.togglePasswordInput(input, element);
		} else if (element.className.match('dice')) {
			element.classList.toggle('on');
		}
	}

	/**
	 * Moves labels up if they were filled by the browser's autofill
	 *
	 * @returns {undefined}
	 */
	private onChange(): void {
		Array.prototype.forEach.call(
			this.inputs,
			(function (input: HTMLInputElement): void {
				var wrapper: HTMLElement = this.findWrapper(input),
					label: HTMLElement = this.findLabel(wrapper);
				if (input.value && wrapper) {
					label.classList.add('active');
				}
			}).bind(this)
		)
	}

	/**
	 * @param {HTMLElement} currentElement
	 *
	 * @returns {HTMLElement}
	 */
	private findWrapper(currentElement: HTMLElement): HTMLElement {
		while (currentElement && !currentElement.classList.contains('input-container')) {
			currentElement = <HTMLElement> currentElement.parentElement;
		}

		return currentElement;
	}

	/**
	 * @param {HTMLElement} container
	 *
	 * @returns {HTMLElement}
	 */
	private findLabel(container: HTMLElement): HTMLElement {
		return <HTMLElement> container.querySelector('label');
	}

	/**
	 * Starts continuous checking for new input
	 *
	 * @returns {undefined}
	 */
	public watch (): void {
		this.onChange();
		this.form.addEventListener('focus', this.onFocus.bind(this), true);
		this.form.addEventListener('blur', this.onBlur.bind(this), true);
		this.form.addEventListener('change', this.onChange.bind(this), true);
		this.form.addEventListener('click', this.onClick.bind(this));
	}
}
