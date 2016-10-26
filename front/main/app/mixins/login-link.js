import LanguagesMixin from './languages';
import {track, trackActions} from 'common/utils/track';

export default Ember.Mixin.create(LanguagesMixin, {
	/**
	 * Creates a link to a login page preserving current page as a redirect
	 * and adding a language code to the querystring
	 * @returns {void}
	 */
	goToLogin(redirectUrl) {
		track({
			trackingMethod: 'ga',
			action: trackActions.click,
			category: 'user-login-mobile',
			label: 'join-link',
		});

		const url = redirectUrl ? redirectUrl : window.location.href;

		window.location.href = `/join?redirect=` +
			`${encodeURIComponent(url)}` +
			`${this.getUselangParam()}`;
	},

	actions: {
		goToLogin() {
			this.goToLogin(...arguments);
		}
	}
});
