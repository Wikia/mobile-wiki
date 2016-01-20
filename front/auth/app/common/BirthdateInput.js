import AutoTab from '../component/AutoTab';

/**
 * @typedef {Object} FormElements
 * @property {HTMLInputElement} birthdate
 * @property {HTMLInputElement} day
 * @property {HTMLInputElement} month
 * @property {HTMLInputElement} year
 */

/**
 * @class BirthDateInput
 *
 * @property {HTMLElement} wrapper
 * @property {NodeList} fakeInputs
 * @property {HTMLInputElement} day
 * @property {HTMLInputElement} month
 * @property {HTMLInputElement} year
 * @property {HTMLInputElement} realInput - The hidden input that will actually be used for the birthday value
 */
export default class BirthdateInput {
	/**
	 * @param {HTMLElement} el
	 * @param {HTMLFormElement} form
	 * @returns {void}
	 */
	constructor(el, form) {
		const elements = form.elements;

		this.wrapper = el;
		this.realInput = elements.birthdate;
		this.day = elements.day;
		this.month = elements.month;
		this.year = elements.year;
		this.fakeInputs = this.wrapper.querySelectorAll('input');
	}

	/**
	 * @returns {void}
	 */
	init() {
		this.initFocus();
		this.initAutoTab();
		this.initBirthdateValue();
	}

	/**
	 * @returns {void}
	 */
	initFocus() {
		const firstInput = this.fakeInputs[0],
			inputContainer = this.wrapper.parentElement;

		/**
		 * @param {Event} event
		 * @returns {void}
		 */
		inputContainer.addEventListener('focus', (event) => {
			const target = event.target;

			if (target === this.realInput) {
				this.realInput.type = 'hidden';
				this.wrapper.classList.remove('hide');
				firstInput.focus();
			}
			this.wrapper.classList.add('focused');
		}, true);

		inputContainer.addEventListener('blur', () => {
			this.wrapper.classList.remove('focused');
		}, true);
	}

	/**
	 * @returns {void}
	 */
	initAutoTab() {
		/**
		 * @param {HTMLInputElement} input
		 * @returns {void}
		 */
		Array.prototype.forEach.call(this.fakeInputs, (input) => {
			new AutoTab(input).init();
		});
	}

	/**
	 * @returns {void}
	 */
	initBirthdateValue() {
		this.wrapper.addEventListener('input', this.setRealValue.bind(this));
	}

	/**
	 * Set the value for the input that will ultimately be saved upon form submission
	 *
	 * @returns {void}
	 */
	setRealValue() {
		const year = this.padLeft(this.year.value, this.year.maxLength),
			month = this.padLeft(this.month.value, this.month.maxLength),
			day = this.padLeft(this.day.value, this.day.maxLength);

		this.realInput.value = `${year}-${month}-${day}`;
	}

	/**
	 * Pad string from left
	 *
	 * @param {HTMLInputElement} input
	 * @param {string} length
	 * @param {string} [padChar='0']
	 * @returns {string}
	 */
	padLeft(input, length, padChar = '0') {
		return Array(length - input.length + 1).join(padChar) + input;
	}
}
