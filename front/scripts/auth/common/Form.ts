/**
 * Controls floating labels behavior on focus / blur events in input fields
 */
class Form {
	loginUsername: HTMLInputElement;
	loginPassword: HTMLInputElement;
	loginSubmit: HTMLButtonElement;

	private onFocus (event: Event): void {
		var element = <HTMLInputElement> event.target,
			nextElement = <HTMLElement> element.nextElementSibling,
			parentElement = <HTMLInputElement> element.parentElement;

		if (parentElement.className.match('input-container')) {
			nextElement.classList.add('active');
		}
	}

	private onBlur (event: Event): void {
		var element = <HTMLInputElement> event.target,
			nextElement = <HTMLElement> element.nextElementSibling,
			parentElement = <HTMLElement> element.parentElement;

		if (parentElement.className.match('input-container') && !element.value) {
			nextElement.classList.remove('active');
		}
	}

	private togglePasswordInput (input: HTMLInputElement, toggler: HTMLElement): void {
		if (input.type === 'password') {
			input.type = 'text';
			toggler.classList.remove('on');
		} else {
			input.type = 'password';
			toggler.classList.add('on');
		}
	}

	private onClick (event: Event): void {
		var element = <HTMLInputElement> event.target,
			parentElement: HTMLElement,
			input: HTMLInputElement;
		if (element.className.match('password-toggler')) {
			parentElement = <HTMLElement> element.parentElement;
			input = <HTMLInputElement> parentElement.querySelector('input');
			this.togglePasswordInput(input, element);
		} else if (element.className.match('dice')) {
			element.classList.toggle('on');
		}
	}

	/**
	 * Starts continuous checking for new input
	 */
	public watch (): void {
		var form = window.document.querySelector('form');
		form.addEventListener('focus', this.onFocus.bind(this), true);
		form.addEventListener('blur', this.onBlur.bind(this), true);
		form.addEventListener('click', this.onClick.bind(this));
	}
}
