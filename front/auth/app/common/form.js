/**
 * Controls floating labels behavior on focus / blur events in input fields
 *
 * @class Form
 *
 * @property {HTMLFormElement} form
 * @property {NodeList} input
 */
export default class Form {
	/**
	 * @param {Element} form
	 * @returns {void}
	 */
	constructor(form) {
		this.form = form;
		this.inputs = this.form.querySelectorAll('input[type=text], input[type=password], input[type=email]');
	}

	/**
	 * @param {Event} event
	 *
	 * @returns {void}
	 */
	onFocus(event) {
		const input = event.target;

		let wrapper, label;

		if (['checkbox', 'submit'].indexOf(input.type) !== -1) {
			return;
		}

		wrapper = this.findWrapper(input);
		label = this.findLabel(wrapper);

		if (input.tagName.toLowerCase() === 'input' && wrapper) {
			label.classList.add('active');
		}
	}

	/**
	 * @returns {void}
	 */
	onBlur() {
		/**
		 * @param {HTMLInputElement} input
		 * @returns {void}
		 */
		Array.prototype.forEach.call(
			this.inputs,
			(input) => {
				const wrapper = this.findWrapper(input),
					label = this.findLabel(wrapper);

				if (!input.classList.contains('fake-input') && input.id !== 'signupBirthDate' &&
					wrapper && input.value === '') {
					label.classList.remove('active');
				}
			}
		);
	}

	/**
	 * @param {HTMLInputElement} input
	 * @param {HTMLElement} toggler
	 *
	 * @returns {void}
	 */
	togglePasswordInput(input, toggler) {
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
	 * @returns {void}
	 */
	onClick(event) {
		const element = event.target;

		if (element.className.match('password-toggler')) {
			const wrapper = element.parentElement,
				input = wrapper.querySelector('input');

			this.togglePasswordInput(input, element);
		} else if (element.className.match('all-passwords-toggler')) {
			Array.from(this.inputs).filter(input => input.classList.contains('input-password'))
			// this way first input will be active
				.reverse()
				.forEach(input => this.togglePasswordInput(input, element));
		} else if (element.className.match('dice')) {
			element.classList.toggle('on');
		}
	}

	/**
	 * Moves labels up if they were filled by the browser's autofill
	 *
	 * @returns {void}
	 */
	onChange() {
		/**
		 * @param {HTMLInputElement} input
		 * @returns {void}
		 */
		Array.prototype.forEach.call(
			this.inputs,
			(input) => {
				const wrapper = this.findWrapper(input),
					label = this.findLabel(wrapper);

				if (input.value && wrapper) {
					label.classList.add('active');
				}
			}
		);
	}

	/**
	 * @param {HTMLElement} currentElement
	 *
	 * @returns {HTMLElement}
	 */
	findWrapper(currentElement) {
		while (currentElement && !currentElement.classList.contains('input-container')) {
			currentElement = currentElement.parentElement;
		}

		return currentElement;
	}

	/**
	 * @param {HTMLElement} container
	 *
	 * @returns {HTMLElement}
	 */
	findLabel(container) {
		return container.querySelector('label');
	}

	/**
	 * Starts continuous checking for new input
	 *
	 * @returns {void}
	 */
	watch() {
		this.onChange();
		this.form.addEventListener('focus', this.onFocus.bind(this), true);
		this.form.addEventListener('blur', this.onBlur.bind(this), true);
		this.form.addEventListener('change', this.onChange.bind(this), true);
		this.form.addEventListener('click', this.onClick.bind(this));
	}
}
