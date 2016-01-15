import LanguagesMixin from './languages';
import {track, trackActions} from '../../mercury/utils/track';

export default Ember.Mixin.create(LanguagesMixin, {
	/**
	 * Creates a link to a login page preserving current page as a redirect
	 * and adding a language code to the querystring
	 * @returns {void}
	 */
	goToLogin() {
		track({
			trackingMethod: 'ga',
			action: trackActions.click,
			category: 'user-login-mobile',
			label: 'join-link',
		});

		window.location.href = `/join?redirect=` +
			`${encodeURIComponent(window.location.href)}` +
			`${this.getUselangParam()}`;
	}
});
