import Geo from '../common/Geo';

/**
 * Creates new Marketing Opt In.
 * @class MarketingOptIn
 *
 * @property {HTMLInputElement} checkbox
 * @property {HTMLLabelElement} label
 * @property {Geo} Geo
 * @property {boolean} isEurope
 * @property {boolean} isCanada
 * @property {boolean} isJapan
 */
export default class MarketingOptIn {
	/**
	 * @returns {void}
	 */
	constructor() {
		this.checkbox = document.getElementById('signupNewsletter');
		this.label = this.checkbox.parentElement;
		this.Geo = new Geo();

		this.isEurope = this.Geo.getContinent() === 'EU';
		this.isCanada = this.Geo.getCountry() === 'CA';
		this.isJapan = this.Geo.getCountry() === 'JP';
	}

	/**
	 * @returns {boolean}
	 */
	shouldBeEnabled() {
		return this.isEurope || this.isCanada || this.isJapan;
	}

	/**
	 * @returns {boolean}
	 */
	shouldBeChecked() {
		return !this.isCanada && !this.isJapan;
	}

	/**
	 * @returns {void}
	 */
	init() {
		if (this.shouldBeChecked()) {
			this.checkbox.checked = true;
		}

		if (this.shouldBeEnabled()) {
			this.label.classList.remove('hide');
		}
	}

}
