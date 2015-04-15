interface DateEndian {
	Big: string;
	Little: string;
	Middle: string;
}

class BirthdateInput {
	el: Element;
	day: HTMLInputElement;
	month: HTMLInputElement;
	year: HTMLInputElement;
	country: string;
	inputs: Array;

	/**
	 * @see http://en.wikipedia.org/wiki/Date_format_by_country
	 * @see http://grammarpartyblog.com/2011/07/17/one-little-endian-two-little-endians-formatting-dates-across-the-globe/
	 */
	static endian: DateEndian = {
		'Big': 'YMD',
		'Little': 'DMY',
		'Middle': 'MDY'
	};

	static map: Object = {
		'US': BirthdateInput.endian.Middle,
		'UK': BirthdateInput.endian.Big
	};

	constructor(el: Element, country: string) {
		this.el = <HTMLInputElement> el;
		this.day = <HTMLInputElement> el.querySelector('.birth-day');
		this.month = <HTMLInputElement> el.querySelector('.birth-month');
		this.year = <HTMLInputElement> el.querySelector('.birth-year');
		this.country = country;
	}

	init(): void {
		this.createInputs();
		this.insertInputs();
		this.initAutoTab();
	}

	initAutoTab(): void {
		this.inputs.forEach(function (input: HTMLInputElement) {
			new AutoTab(input).init();
		});
	}

	private createInputs() {
		var inputs = {},
			inputData = [
			{
				name: 'day',
				maxLength: 2,
				maxVal: 31
			},
			{
				name: 'month',
				maxLength: 2,
				maxVal: 12
			},
			{
				name: 'year',
				maxLength: 4,
				maxVal: new Date().getFullYear()
			}
		];

		inputData.forEach(function (data) {
			inputs[data.name] = this.createInput(data);
		}, this);

		this.inputs = this.orderInputsByLocale(inputs, this.country)
	}

	private insertInputs() {
		var lastIndex = this.inputs.length - 1,
			separator = document.createElement('span');
		separator.innerHTML = '/';

		this.inputs.forEach(function (input, index) {
			this.el.appendChild(input);
			if (index < lastIndex) {
				this.el.appendChild(separator.cloneNode(true));
			}
		}, this);
	}

	private createInput(options): HTMLInputElement {
		var input = document.createElement('input');
		input.type = 'number';
		input.required = true;
		input.name = options.name;
		input.className = 'birth-' + options.name + ' auto-tab';
		input.setAttribute('data-max-length', options.maxLength);
		input.setAttribute('max', options.maxVal);
		return input;
	}

	private orderInputsByLocale(inputsObj, locale) {
		var endian = BirthdateInput.map[locale],
			inputsArr = [];

		switch(endian) {
			case BirthdateInput.endian.Big:
				inputsArr = [inputsObj.year, inputsObj.month, inputsObj.day];
				break;
			case BirthdateInput.endian.Middle:
				inputsArr = [inputsObj.month, inputsObj.day, inputsObj.year];
				break;
			default: // BirthdateInput.endian.Little
				inputsArr = [inputsObj.day, inputsObj.month, inputsObj.year];
				break;
		}
		return inputsArr;
	}
}
