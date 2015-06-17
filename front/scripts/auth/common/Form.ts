/**
 * Controls floating labels behavior on focus / blur events in input fields
 */
class Form {
	form: HTMLFormElement;
	inputs: NodeList;

	constructor (form: Element) {
		this.form = <HTMLFormElement> form;
		this.inputs = this.form.querySelectorAll('input[type=text], input[type=password], input[type=email]');
	}

	private onFocus (event: Event): void {
		var input: HTMLInputElement = <HTMLInputElement> event.target,
			wrapper: HTMLElement,
			label: HTMLElement;

		if (input.type === 'checkbox') {
			return;
		}

		wrapper = <HTMLElement> this.findWrapper(input);
		label = <HTMLElement> this.findLabel(wrapper);

		if (input.tagName.toLowerCase() === 'input' && wrapper) {
			label.classList.add('active');
		}
	}

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

	private findWrapper(currentElement: HTMLElement): HTMLElement {
		while (currentElement && !currentElement.classList.contains('input-container')) {
			currentElement = <HTMLElement> currentElement.parentElement;
		}

		return currentElement;
	}

	private findLabel(container: HTMLElement): HTMLElement {
		return <HTMLElement> container.querySelector('label');
	}

	/**
	 * Starts continuous checking for new input
	 */
	public watch (): void {
		this.onChange();
		this.form.addEventListener('focus', this.onFocus.bind(this), true);
		this.form.addEventListener('blur', this.onBlur.bind(this), true);
		this.form.addEventListener('change', this.onChange.bind(this), true);
		this.form.addEventListener('click', this.onClick.bind(this));
	}
}
