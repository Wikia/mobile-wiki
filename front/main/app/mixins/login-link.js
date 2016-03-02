import LanguagesMixin from './languages';

export default Ember.Mixin.create(LanguagesMixin, {
	/**
	 * Creates a link to a login page preserving current page as a redirect
	 * and adding a language code to the querystring
	 * @returns {void}
	 */
	goToLogin() {
		window.location.href = `/join?redirect=` +
			`${encodeURIComponent(window.location.href)}` +
			`${this.getUselangParam()}`;
	}
});
