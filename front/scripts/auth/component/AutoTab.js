/**
 * @class AutoTab
 *
 * @property {HTMLInputElement} input
 * @property {HTMLFormElement} form
 * @property {number} max
 */
export default class AutoTab {
	/**
	 * @constructs AutoTab
	 *
	 * @param {HTMLInputElement} input
	 * @returns {void}
	 */
	constructor(input) {
		this.input = input;
		this.form = input.form;
		this.max = parseInt(input.getAttribute('maxlength'), 10);
	}

	/**
	 * @returns {void}
	 */
	init() {
		this.input.addEventListener('input', this.onInput.bind(this));
		// Jump to the next field if the input was autocompleted
		this.input.addEventListener('change', this.onInput.bind(this));
	}

	/**
	 * @returns {void}
	 */
	onInput() {
		const nextVisibleInput = this.getNextVisibleInput(),
			length = this.input.value.length;

		if (length >= this.max && nextVisibleInput) {
			nextVisibleInput.focus();
		}
	}

	/**
	 * Get an array of all visible elements in the form
	 *
	 * @returns {object}
	 */
	getVisibleElements() {
		/**
		 * @param {HTMLElement} element
		 * @returns {boolean}
		 */
		return Array.prototype.filter.call(this.form.elements, (element) => {
			return element.type !== 'hidden';
		});
	}

	/**
	 * Get the non-hidden input following this auto-tab input
	 *
	 * @returns {object}
	 */
	getNextVisibleInput() {
		const elements = this.getVisibleElements();

		let nextInput = null;

		/**
		 * @param {HTMLElement} element
		 * @param {number} index
		 * @returns {boolean}
		 */
		elements.every((element, index) => {
			if (element === this.input) {
				nextInput = elements[index + 1];
				return false;
			}
			return true;
		});

		return nextInput;
	}
}
