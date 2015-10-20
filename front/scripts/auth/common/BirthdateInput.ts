/**
 * FormElements
 * @typedef {object} FormElements
 * @property {HTMLInputElement} birthdate
 * @property {HTMLInputElement} day
 * @property {HTMLInputElement} month
 * @property {HTMLInputElement} year
 */
interface FormElements extends HTMLCollection {
	birthdate: HTMLInputElement;
	day: HTMLInputElement;
	month: HTMLInputElement;
	year: HTMLInputElement;
}

/**
 * @class BirthDateInput
 */
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

	/**
	 * @constructs BirthdateInput
	 * @param {HTMLElement} el
	 * @param {HTMLFormElement} form
	 */
	constructor(el: HTMLElement, form: HTMLFormElement) {
		var elements: FormElements = <FormElements>form.elements;

		this.wrapper = el;
		this.realInput = elements.birthdate;
		this.day = elements.day;
		this.month = elements.month;
		this.year = elements.year;
		this.fakeInputs = this.wrapper.querySelectorAll('input');
	}

	/**
	 * @retuns {void}
	 */
	public init(): void {
		this.initFocus();
		this.initAutoTab();
		this.initBirthdateValue();
	}

	/**
	 * @retuns {void}
	 */
	private initFocus(): void {
		var firstInput: HTMLInputElement = <HTMLInputElement>this.fakeInputs[0],
			inputContainer = <HTMLElement> this.wrapper.parentElement,
			target: HTMLElement;

		inputContainer.addEventListener('focus', ((event: Event): void => {
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

	/**
	 * @retuns {void}
	 */
	private initAutoTab(): void {
		Array.prototype.forEach.call(this.fakeInputs, function (input: HTMLInputElement) {
			new AutoTab(input).init();
		});
	}

	/**
	 * @retuns {void}
	 */
	private initBirthdateValue(): void {
		this.wrapper.addEventListener('input', this.setRealValue.bind(this));
	}

	/**
	 * Set the value for the input that will ultimately be saved upon form submission
	 *
	 * @retuns {void}
	 */
	private setRealValue(): void {
		this.realInput.value = this.padLeft(this.year.value, this.year.maxLength) + '-' +
			this.padLeft(this.month.value, this.month.maxLength) + '-' +
			this.padLeft(this.day.value, this.day.maxLength);
	}

	/**
	 * Pad string from left
	 *
	 * @param input input string
	 * @param length output string length
	 * @param padChar string used for padding, default '0'
	 * @returns {string}
	 */
	private padLeft(input: string, length: number, padChar: string = '0'): string {
		return Array(length - input.length + 1).join(padChar) + input;
	}
}
