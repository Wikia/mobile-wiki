interface FormElements extends HTMLCollection {
	birthdate: HTMLInputElement;
	day: HTMLInputElement;
	month: HTMLInputElement;
	year: HTMLInputElement;
}

class BirthdateInput {
	wrapper: HTMLElement;
	fakeInputs: NodeList;
	day: HTMLInputElement;
	month: HTMLInputElement;
	year: HTMLInputElement;
	/**
	 * The (ultimately hidden) input that will actually be used for the birthday value
	 */
	realInput: HTMLInputElement;

	constructor(el: HTMLElement, form: HTMLFormElement) {
		var elements: FormElements = <FormElements>form.elements;

		this.wrapper = el;
		this.realInput = elements.birthdate;
		this.day = elements.day;
		this.month = elements.month;
		this.year = elements.year;
		this.fakeInputs = this.wrapper.querySelectorAll('input');
	}

	public init(): void {
		this.initFocus();
		this.initAutoTab();
		this.initBirthdateValue();
	}

	private initFocus(): void {
		var firstInput: HTMLInputElement = <HTMLInputElement>this.fakeInputs[0],
			inputContainer = <HTMLElement> this.wrapper.parentElement,
			target: HTMLElement;

		inputContainer.addEventListener('focus', ((): void => {
			target = <HTMLElement> event.target;
			if (target === this.realInput) {
				this.realInput.type = 'hidden';
				this.wrapper.classList.remove('hide');
				firstInput.focus();
			}
			this.wrapper.classList.add('focused');
		}).bind(this), true);

		inputContainer.addEventListener('blur', ((): void => {
			this.wrapper.classList.remove('focused');
		}).bind(this), true);
	}

	private initAutoTab(): void {
		Array.prototype.forEach.call(this.fakeInputs, function (input: HTMLInputElement) {
			new AutoTab(input).init();
		});
	}

	private initBirthdateValue(): void {
		this.wrapper.addEventListener('input', this.setRealValue.bind(this));
	}

	/**
	 * Set the value for the input that will ultimately be saved upon form submission
	 */
	private setRealValue(): void {
		this.realInput.value = this.year.value + '-' + this.month.value + '-' + this.day.value;
	}
}
