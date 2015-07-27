class TermsOfUse {
	termsOfUseContainer: HTMLElement;
	checkbox: HTMLInputElement;
	label: HTMLLabelElement;
	form: HTMLFormElement
	Geo: Geo;
	isJapan: boolean;

	constructor (form: HTMLFormElement) {
		this.form = form;
		this.Geo = new Geo();

		this.isJapan = this.Geo.getCountry() === 'JP';
	}

	public shouldDisplayCheckbox (): boolean {
		return this.isJapan;
	}

	public init () {
		if (this.shouldDisplayCheckbox()) {
			this.termsOfUseContainer = document.getElementById('termsOfUse');
			this.termsOfUseContainer.style.display = 'none';

			this.checkbox = document.createElement('input');
			this.checkbox.type = 'checkbox';
			this.checkbox.name = 'termsOfUse';
			this.checkbox.id = 'termsOfUseCheckbox';
			this.checkbox.required = true;
			this.label = document.createElement('label');
			this.label.appendChild(this.checkbox);
			this.label.innerHTML += this.termsOfUseContainer.innerHTML;
			this.label.classList.add('inline');
			this.label.htmlFor = 'termsOfUseCheckbox';

			this.form.insertBefore(this.label, document.getElementById('signupSubmit'));
		}
	}
}
