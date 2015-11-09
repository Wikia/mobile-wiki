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
class MarketingOptIn {
	/**
	 * @constructs MarketingOptIn
	 */
	constructor() {
		this.checkbox = document.getElementById('signupNewsletter');
		this.label = this.checkbox.parentElement;
		this.Geo = new Geo();

		this.isEurope = this.Geo.getContinent() === 'EU';
		this.isCanada = this.Geo.getCountry() === 'CA';
		this.isJapan = this.Geo.getCountry() === 'JP';
	}

	shouldBeEnabled() {
		return this.isEurope || this.isCanada || this.isJapan;
	}

	shouldBeChecked() {
		return !this.isCanada && !this.isJapan;
	}

	init() {
		if (this.shouldBeChecked()) {
			this.checkbox.checked = true;
		}

		if (this.shouldBeEnabled()) {
			this.label.classList.remove('hide');
		}
	}

}
