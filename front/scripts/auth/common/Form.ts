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
		var input = <HTMLInputElement> event.target,
			label = <HTMLElement> input.nextElementSibling,
			wrapper = <HTMLInputElement> input.parentElement;

		if (input.tagName.toLowerCase() === 'input' && wrapper.className.match('input-container')) {
			label.classList.add('active');
		}
	}

	private onBlur (event: Event): void {
		Array.prototype.forEach.call(this.inputs, function (input: HTMLInputElement): void {
			var label = <HTMLElement> input.nextElementSibling,
				wrapper = <HTMLElement> input.parentElement;
			if (wrapper.className.match('input-container') && !input.value) {
				label.classList.remove('active');
			}
		});
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
		var element = <HTMLInputElement> event.target,
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
			function (input: HTMLInputElement): void {
				var label = <HTMLLabelElement> input.nextElementSibling,
					wrapper = <HTMLElement> input.parentElement;
				if (input.value && wrapper.className.indexOf('input-container') > -1) {
					label.classList.add('active');
				}
			}
		)
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
