class AutoTab {
	input: HTMLInputElement;
	nextInput: Element;
	max: number;
	isLast: boolean;

	constructor(input: Element) {
		this.input = <HTMLInputElement> input;
		this.nextInput = <HTMLInputElement> input.nextElementSibling;
		this.isLast = !!input.className.match('auto-tab-end');

		console.log(!!input.className.match('auto-tab-end'));

		if (!this.isLast && this.nextInput.nodeName.toLowerCase() !== 'input') {
			throw new Error('AutoTab inputs must be followed by another HTMLInputElement');
		}
		this.max = <number> input.dataset.maxLength;
	}

	public init(): void {
		this.input.addEventListener('input', this.onInput.bind(this));
	}

	private onInput(event: Event) {
		var length, badInput;

		badInput = this.input.validity.badInput;
		if (badInput) {
			// TODO: show an error message or prevent
			console.log('There was a bad input, display and error message');
		}

		length = this.input.value.length;
		if (length >= this.max) {
			if (!this.isLast) {
				this.nextInput.focus();
			} else {
				this.input.value = this.input.value.substr(0, this.max);
			}
		}
	}
}
