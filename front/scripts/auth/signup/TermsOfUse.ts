declare var pageParams: any;

/**
 * Creates new TermsOfUse.
 * @class
 */
class TermsOfUse {
	form: HTMLFormElement;
	Geo: Geo;
	isJapan: boolean;

	/**
	 * @constructor
	 * @param {HTMLFormElement} form
	 */
	constructor (form: HTMLFormElement) {
		this.form = form;
		this.Geo = new Geo();

		this.isJapan = this.Geo.getCountry() === 'JP';
	}

	/**
	 * @returns {boolean}
	 */
	public shouldDisplayCheckbox (): boolean {
		return this.isJapan;
	}

	/**
	 * @returns {undefined}
	 */
	public init () {
		if (this.shouldDisplayCheckbox()) {
			var checkbox: HTMLInputElement = document.createElement('input'),
				label: HTMLLabelElement = document.createElement('label');

			document.getElementById('termsOfUse').style.display = 'none';

			checkbox.type = 'checkbox';
			checkbox.name = 'termsOfUse';
			checkbox.id = 'termsOfUseCheckbox';
			checkbox.required = true;
			label.appendChild(checkbox);
			label.innerHTML += i18n.t(
				'labels.terms-of-use-and-privacy-policy-text',
				{
					termsOfUseLink: pageParams.termsOfUseLink,
					privacyPolicyLink: pageParams.privacyPolicyLink
				}
			);
			label.classList.add('inline');
			label.htmlFor = 'termsOfUseCheckbox';

			this.form.insertBefore(label, document.getElementById('signupSubmit'));
		}
	}
}
