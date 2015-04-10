class AutoTab {
	input: HTMLInputElement;
	nextInput: HTMLElement;
	max: number;
	isLast: boolean;

	constructor(input: HTMLInputElement) {
		var form: HTMLFormElement = input.form,
			elements: Array<HTMLElement> = AutoTab.getVisibleFormElements(form),
			nextInput: any = AutoTab.getNextInput(elements, input);

		this.input = input;
		this.nextInput = nextInput;
		this.isLast = !!input.className.match('auto-tab-end');

		this.max = parseInt(input.getAttribute('data-max-length'));
	}

	public init(): void {
		this.input.addEventListener('input', this.onInput.bind(this));
	}

	private onInput() {
		//var badInput: boolean = this.input.validity.badInput;
		//
		//if (badInput) {
		//	// TODO: show an error message or prevent
		//	console.log('There was a bad input, display and error message');
		//}

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
	private static getVisibleFormElements(form: HTMLFormElement): any {
		var elements: any;

		elements = Array.prototype.filter.call(form.elements, function (element: HTMLInputElement) {
			return element.type !== 'hidden';
		});

		return elements;
	}

	/**
	 * Get the input after the current one, if it exists
	 */
	private static getNextInput(elements: Array<any>, input: HTMLInputElement): any {
		var nextInput: any = null;

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
