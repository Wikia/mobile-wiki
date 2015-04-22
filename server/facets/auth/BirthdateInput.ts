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

interface DateElements {
	day: InputData;
	month: InputData;
	year: InputData;
}

class BirthdateInput {
	inputData: Array<InputData>;
	endian: string;
	i18n: any;

	/**
	 * A date endian is the order in which year, month, and day are displayed
	 * @see http://en.wikipedia.org/wiki/Date_format_by_country
	 * @see http://grammarpartyblog.com/2011/07/17/one-little-endian-two-little-endians-formatting-dates-across-the-globe/
	 */
	endians: DateEndian = {
		Big: 'Big',
		Little: 'Little',
		Middle: 'Middle'
	};

	constructor(endian: string, i18n: any) {
		this.endian = endian;
		this.i18n = i18n;
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
				placeholder: this.i18n.t('auth:date.day-format'),
				separator: this.i18n.t('auth:date.day-separator')
			},
			'month': {
				name: 'month',
				maxLength: 2,
				maxVal: 12,
				placeholder: this.i18n.t('auth:date.month-format'),
				separator: this.i18n.t('auth:date.month-separator')
			},
			'year': {
				name: 'year',
				maxLength: 4,
				maxVal: new Date().getFullYear(),
				placeholder: this.i18n.t('auth:date.year-format'),
				separator: this.i18n.t('auth:date.year-separator')
			}
		};

		this.inputData = this.orderInputDataByLocale(inputData);
	}

	private orderInputDataByLocale(data: DateElements): Array<InputData> {
		var inputsArr: Array<InputData> = [],
			endian = this.endian.toLowerCase();

		switch (endian) {
			case this.endians.Big.toLowerCase():
				inputsArr = [data.year, data.month, data.day];
				break;
			case this.endians.Middle.toLowerCase():
				inputsArr = [data.month, data.day, data.year];
				break;
			default: // this.endians.Little.toLowerCase()
				inputsArr = [data.day, data.month, data.year];
				break;
		}
		return inputsArr;
	}
}

export = BirthdateInput;
