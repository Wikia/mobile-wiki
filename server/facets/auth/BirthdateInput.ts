import dateUtils = require('../../lib/DateUtils');

class BirthdateInput {
	inputData: Array<InputData>;
	endian: string;
	lang: string;

	/**
	 * A date endian is the order in which year, month, and day are displayed
	 * @see http://en.wikipedia.org/wiki/Date_format_by_country
	 * @see http://grammarpartyblog.com/2011/07/17/one-little-endian-two-little-endians-formatting-dates-across-the-globe/
	 */
	endians: DateEndian = {
		big: 'big',
		little: 'little',
		middle: 'middle'
	};

	constructor(endian: string, lang: string) {
		this.endian = endian;
		this.lang = lang;
	}

	public getInputData(): Array<InputData> {
		if (!this.inputData) {
			this.setInputData();
		}
		return this.inputData;
	}

	private setInputData(): void {
		var inputData: DateElements = {
			'day': {
				name: 'day',
				maxLength: 2,
				maxVal: 31,
				placeholder: dateUtils.get('day-format', this.lang),
				separator: dateUtils.get('day-separator', this.lang)
			},
			'month': {
				name: 'month',
				maxLength: 2,
				maxVal: 12,
				placeholder: dateUtils.get('month-format', this.lang),
				separator: dateUtils.get('month-separator', this.lang)
			},
			'year': {
				name: 'year',
				maxLength: 4,
				maxVal: new Date().getFullYear(),
				placeholder: dateUtils.get('year-format', this.lang),
				separator: dateUtils.get('year-separator', this.lang)
			}
		};

		this.inputData = this.orderInputDataByLocale(inputData);
	}

	private orderInputDataByLocale(data: DateElements): Array<InputData> {
		var inputsArr: Array<InputData> = [],
			endian = this.endian.toLowerCase();

		switch (endian) {
			case this.endians.big.toLowerCase():
				inputsArr = [data.year, data.month, data.day];
				break;
			case this.endians.middle.toLowerCase():
				inputsArr = [data.month, data.day, data.year];
				break;
			default: // this.endians.little.toLowerCase()
				inputsArr = [data.day, data.month, data.year];
				break;
		}
		return inputsArr;
	}
}

export = BirthdateInput;
