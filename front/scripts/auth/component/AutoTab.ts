
/**
 * @class AutoTab
 */
class AutoTab {
	input: HTMLInputElement;
	form: HTMLFormElement;
	max: number;

	/**
	 * @constructs AutoTab
	 * @param {HTMLInputElement} input
	 */
	constructor(input: HTMLInputElement) {
		this.input = input;
		this.form = input.form;
		this.max = parseInt(input.getAttribute('maxlength'), 10);
	}

	/**
	 * @returns {undefined}
	 */
	public init(): void {
		this.input.addEventListener('input', this.onInput.bind(this));
		//Jump to the next field if the input was autocompleted
		this.input.addEventListener('change', this.onInput.bind(this));
	}

	/**
	 * @returns {undefined}
	 */
	private onInput(): void {
		var nextVisibleInput = this.getNextVisibleInput(),
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
	private getVisibleElements(): any {
		return Array.prototype.filter.call(this.form.elements, function (element: HTMLInputElement) {
			return element.type !== 'hidden';
		});
	}

	/**
	 * Get the non-hidden input following this auto-tab input
	 *
	 * @returns {object}
	 */
	private getNextVisibleInput() {
		var elements: any = this.getVisibleElements(),
			nextInput: any = null;

		elements.every(function (element: HTMLElement, index: number) {
			if (element === this.input) {
				nextInput = elements[index + 1];
				return false;
			}
			return true;
		}, this);

		return nextInput;
	}
}
