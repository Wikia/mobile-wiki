interface FormElements {
	birthdate: HTMLInputElement;
	day: HTMLInputElement;
	month: HTMLInputElement;
	year: HTMLInputElement;
}

class BirthdateInput {
	el: HTMLElement;
	fakeInput: HTMLInputElement;
	birthdateInputs: NodeList;
	day: HTMLInputElement;
	month: HTMLInputElement;
	year: HTMLInputElement;

	constructor(el: HTMLElement, form: HTMLFormElement) {
		var elements: FormElements = <FormElements> form.elements;
		this.el = el;
		this.fakeInput = elements.birthdate;
		this.day = elements.day;
		this.month = elements.month;
		this.year = elements.year;
		this.birthdateInputs = this.el.querySelectorAll('input');
	}

	public init(): void {
		this.initFocus();
		this.initAutoTab();
		this.initBirthdateValue();
	}

	private initFocus(): void {
		var firstInput: HTMLInputElement = <HTMLInputElement> this.birthdateInputs[0];
		this.fakeInput.addEventListener('focus', (() => {
			this.fakeInput.type = 'hidden';
			this.el.classList.remove('hide');
			firstInput.focus();
		}).bind(this));
	}

	private initAutoTab(): void {
		Array.prototype.forEach.call(this.el.querySelectorAll('.auto-tab'), function (input: HTMLInputElement) {
			new AutoTab(input).init();
		});
	}

	private initBirthdateValue(): void {
		this.el.addEventListener('input', this.onBirthdateInput.bind(this));
	}

	/**
	 * Set the value for the input that will ultimately be saved upon form submission
	 */
	private onBirthdateInput(): void {
		this.fakeInput.value = this.year.value + '-' + this.month.value + '-' + this.day.value;
	}
}
