declare var pageParams: any;

class TermsOfUse {
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
			var checkbox: HTMLInputElement = document.createElement('input'),
				label: HTMLLabelElement = document.createElement('label');

			document.getElementById('termsOfUse').style.display = 'none';

			checkbox = document.createElement('input');
			checkbox.type = 'checkbox';
			checkbox.name = 'termsOfUse';
			checkbox.id = 'termsOfUseCheckbox';
			checkbox.required = true;
			label = document.createElement('label');
			label.appendChild(checkbox);
			label.innerHTML += i18n.t(
				'labels.terms-of-use-and-privacy-policy-text',
				{
					termsOfUseLink: pageParams.termsOfUserLink,
					privacyPolicyLink: pageParams.privacyPolicyLink
				}
			);
			label.classList.add('inline');
			label.htmlFor = 'termsOfUseCheckbox';

			this.form.insertBefore(label, document.getElementById('signupSubmit'));
		}
	}
}
