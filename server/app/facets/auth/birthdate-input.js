import authLocaleSettings from '../../../config/authLocaleSettings';

/**
 * @typedef {Object} DateEndian
 *
 * A date endian is the order in which year, month, and day are displayed
 * @see http://en.wikipedia.org/wiki/Date_format_by_country
 * @see http://grammarpartyblog.com/2011/07/17/one-little-endian-two-little-endians-formatting-dates-across-the-globe/
 *
 * @property {string} big
 * @property {string} little
 * @property {string} middle
 */

/**
 * @typedef {Object} InputData
 * @property {string} name
 * @property {number} maxLength
 * @property {number} maxVal
 * @property {string} placeholder
 */

/**
 * @typedef {Object} DateElements
 * @property {InputData} day
 * @property {InputData} month
 * @property {InputData} year
 */


/**
 * @class BirthdateInput
 *
 * @property {InputData[]} inputData
 * @property {string} endian
 * @property {string} lang
 * @property {*} settings
 */
export default class BirthdateInput {
	/**
	 * @param {string} endian
	 * @param {string} lang
	 * @returns {void}
	 */
	constructor(endian, lang) {
		const langSettings = authLocaleSettings[lang];

		this.endian = endian;
		this.settings = langSettings ? langSettings.date : authLocaleSettings.en.date;
	}

	/**
	 * @returns {InputData[]}
	 */
	getInputData() {
		if (!this.inputData) {
			this.setInputData();
		}
		return this.inputData;
	}

	setInputData() {
		const inputData = {
			day: {
				name: 'day',
				maxLength: 2,
				maxVal: 31,
				placeholder: this.settings.dayFormat,
				separator: this.settings.daySeparator
			},
			month: {
				name: 'month',
				maxLength: 2,
				maxVal: 12,
				placeholder: this.settings.monthFormat,
				separator: this.settings.monthSeparator
			},
			year: {
				name: 'year',
				maxLength: 4,
				maxVal: new Date().getFullYear(),
				placeholder: this.settings.yearFormat,
				separator: this.settings.yearSeparator
			}
		};

		this.inputData = this.orderInputDataByLocale(inputData);
	}

	/**
	 * @param {DateElements} data
	 * @returns {InputData[]}
	 */
	orderInputDataByLocale(data) {
		const endian = this.endian.toLowerCase();

		switch (endian) {
			case 'big':
				return [data.year, data.month, data.day];
			case 'middle':
				return [data.month, data.day, data.year];
			default:
				// endian = 'little' is also covered by default
				return [data.day, data.month, data.year];
		}
	}
}
