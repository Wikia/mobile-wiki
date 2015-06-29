class MarketingOptIn {
	checkbox: HTMLInputElement;
	label: HTMLLabelElement;
	Geo: Geo;
	isEurope: boolean;
	isCanada: boolean;
	isJapan: boolean;

	constructor () {
		this.checkbox = document.getElementById('signupNewsletter');
		this.label = this.checkbox.parentElement;
		this.Geo = new Geo();

		this.isEurope = this.Geo.getContinent() === 'EU';
		this.isCanada = this.Geo.getCountry() === 'CA';
		this.isJapan = this.Geo.getCountry() === 'JP';
	}

	public shouldBeEnabled (): boolean {
		return this.isEurope || this.isCanada || this.isJapan;
	}

	public shouldBeChecked () {
		return !this.isCanada && !this.isJapan;
	}

	public init () {
		if (this.shouldBeChecked()) {
			this.checkbox.checked = true;
		}
debugger;
		if (this.shouldBeEnabled()) {
			this.label.classList.remove('hide');
		}
	}

}
