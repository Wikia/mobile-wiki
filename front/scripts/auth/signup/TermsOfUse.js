import Geo from '../common/Geo';

/**
 * Creates new TermsOfUse.
 * @class TermsOfUse
 *
 * @property {HTMLFormElement} form
 * @property {Geo} Geo
 * @property {boolean} isJapan
 */

export default class TermsOfUse {
	/**
	 * @param {HTMLFormElement} form
	 * @returns {void}
	 */
	constructor(form) {
		this.form = form;
		this.Geo = new Geo();

		this.isJapan = this.Geo.getCountry() === 'JP';
	}

	/**
	 * @returns {boolean}
	 */
	shouldDisplayCheckbox() {
		return this.isJapan;
	}

	/**
	 * @returns {void}
	 */
	init() {
		if (this.shouldDisplayCheckbox()) {
			const checkbox = document.createElement('input'),
				label = document.createElement('label');

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
