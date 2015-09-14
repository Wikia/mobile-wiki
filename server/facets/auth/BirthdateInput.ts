import localeSettings = require('../../../config/localeSettings');

class BirthdateInput {
	inputData: Array<InputData>;
	endian: string;
	lang: string;
	settings: any;

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
		var langSettings = localeSettings[lang];
		this.endian = endian;
		this.lang = lang;
		this.settings = langSettings ? langSettings.date : localeSettings['en'].date;
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
				placeholder: this.settings.dayFormat,
				separator: this.settings.daySeparator
			},
			'month': {
				name: 'month',
				maxLength: 2,
				maxVal: 12,
				placeholder: this.settings.monthFormat,
				separator: this.settings.monthSeparator
			},
			'year': {
				name: 'year',
				maxLength: 4,
				maxVal: new Date().getFullYear(),
				placeholder: this.settings.yearFormat,
				separator: this.settings.yearSeparator
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
