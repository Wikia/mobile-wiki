interface DateEndian {
	Big: string;
	Little: string;
	Middle: string;
}

interface InputData {
	name: string;
	maxLength: number;
	maxVal: number;
	placeholder: string;
}

class BirthdateInput {
	el: Element;
	day: HTMLInputElement;
	month: HTMLInputElement;
	year: HTMLInputElement;
	locale: string;
	inputData: Array<InputData>;
	inputs: Array;
	endian: string;
	separator: string;
	label: HTMLLabelElement;

	/**
	 * @see http://en.wikipedia.org/wiki/Date_format_by_country
	 * @see http://grammarpartyblog.com/2011/07/17/one-little-endian-two-little-endians-formatting-dates-across-the-globe/
	 */
	static endians: DateEndian = {
		'Big': 'YMD',
		'Little': 'DMY',
		'Middle': 'MDY'
	};

	static map: Object = {
		'US': BirthdateInput.endians.Middle,
		'UK': BirthdateInput.endians.Big
	};

	constructor(el: Element, locale: string) {
		this.el = <HTMLInputElement> el;
		this.day = <HTMLInputElement> el.querySelector('.birth-day');
		this.month = <HTMLInputElement> el.querySelector('.birth-month');
		this.year = <HTMLInputElement> el.querySelector('.birth-year');
		this.locale = locale;
		this.endian = BirthdateInput.map[this.locale];
		this.separator = '/';
		this.label = this.createLabel(this.getLabelText());

	}

	public init(): void {
		this.setInputData();
		this.setInputs();
		this.insertInputs();
		this.insertLabel();
		this.initAutoTab();
	}

	private setInputData() {
		this.inputData = [
			{
				name: 'day',
				maxLength: 2,
				maxVal: 31,
				placeholder: 'DD'
			},
			{
				name: 'month',
				maxLength: 2,
				maxVal: 12,
				placeholder: 'MM'
			},
			{
				name: 'year',
				maxLength: 4,
				maxVal: new Date().getFullYear(),
				placeholder: 'YYYY'
			}
		]
	}

	private setInputs() {
		var inputs = {};

		this.inputData.forEach(function (data) {
			inputs[data.name] = this.createInput(data);
		}, this);

		this.inputs = this.orderInputsByLocale(inputs)
	}

	private createInput(options): HTMLInputElement {
		var input = document.createElement('input');
		input.type = 'number';
		input.required = true;
		input.name = options.name;
		input.className = 'birth-' + options.name + ' auto-tab';
		input.setAttribute('data-max-length', options.maxLength);
		input.setAttribute('max', options.maxVal);
		input.setAttribute('placeholder', options.placeholder);
		return input;
	}

	private orderInputsByLocale(inputsObj) {
		var inputsArr = [];

		switch(this.endian) {
			case BirthdateInput.endians.Big:
				inputsArr = [inputsObj.year, inputsObj.month, inputsObj.day];
				break;
			case BirthdateInput.endians.Middle:
				inputsArr = [inputsObj.month, inputsObj.day, inputsObj.year];
				break;
			default: // BirthdateInput.endians.Little
				inputsArr = [inputsObj.day, inputsObj.month, inputsObj.year];
				break;
		}
		return inputsArr;
	}

	private insertInputs() {
		var lastIndex = this.inputs.length - 1,
			separator = document.createElement('span');
		separator.innerHTML = this.separator;

		this.inputs.forEach(function (input, index) {
			this.el.appendChild(input);
			if (index < lastIndex) {
				this.el.appendChild(separator.cloneNode(true));
			}
		}, this);
	}

	private createLabel(labelText): HTMLLabelElement {
		var label = document.createElement('label');
		label.innerHTML = labelText;
		return label;
	}

	private getLabelText():string {
		var labelMap = {},
			month = 'MM',
			year = 'YYYY',
			day = 'DD';

		labelMap[BirthdateInput.endians.Big] = year + this.separator + month + this.separator + day;
		labelMap[BirthdateInput.endians.Middle] = month + this.separator + day + this.separator + year;
		labelMap[BirthdateInput.endians.Little] = day + this.separator + month + this.separator + year;

		return labelMap[this.endian];
	}

	private insertLabel() {
		this.el.appendChild(this.label);
	}

	private initAutoTab(): void {
		this.inputs.forEach(function (input: HTMLInputElement) {
			new AutoTab(input).init();
		});
	}
}
