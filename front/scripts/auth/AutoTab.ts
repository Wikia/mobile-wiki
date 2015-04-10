class AutoTab {
	input: HTMLInputElement;
	nextInput: Element;
	max: number;
	isLast: boolean;

	constructor(input: HTMLInputElement) {
		var form: HTMLFormElement = input.form,
			elements: Array = AutoTab.getVisibleFormElements(form),
			nextInput: any = AutoTab.getNextInput(elements, input);

		this.input = input;
		this.nextInput = nextInput;
		this.isLast = !!input.className.match('auto-tab-end');

		this.max = <number> input.dataset.maxLength;
	}

	public init(): void {
		this.input.addEventListener('input', this.onInput.bind(this));
	}

	private onInput() {
		var badInput: boolean = this.input.validity.badInput;

		if (badInput) {
			// TODO: show an error message or prevent
			console.log('There was a bad input, display and error message');
		}

		if (this.shouldTab()) {
			this.nextInput.focus();
		}
	}

	private shouldTab(): boolean {
		var length = this.input.value.length;

		return (
			length >= this.max &&
			this.nextInput &&
			!this.isLast
		);
	}

	/**
	 * Get an array of all visible elements in a form
	 */
	private static getVisibleFormElements(form): Array {
		var elements;

		elements = Array.prototype.filter.call(form.elements, function (element) {
			return element.type !== 'hidden';
		});

		return elements;
	}

	/**
	 * Get the input after the current one, if it exists
	 */
	private static getNextInput(elements: Array, input: HTMLInputElement): any {
		var nextInput = null;

		elements.every(function (element, index) {
			if (element === input) {
				nextInput = elements[index + 1];
				return false;
			}
			return true;
		}, this);

		return nextInput;
	}
}
