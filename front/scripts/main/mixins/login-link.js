import LanguagesMixin from './languages';
import {track, trackActions} from '../../mercury/utils/track';

export default Ember.Mixin.create(LanguagesMixin, {
	/**
	 * Creates a link to a login page preserving current page as a redirect
	 * and adding a language code to the querystring
	 * @returns {void}
	 */
	goToLogin() {
		let label,
			href;

		if (Mercury.wiki.enableNewAuth) {
			href = `/join?redirect=` +
			`${encodeURIComponent(window.location.href)}` +
			`${this.getUselangParam()}`;
			label = 'join-link';
		} else {
			label = 'legacy-login-link';
			href = '/Special:UserLogin';
		}

		track({
			trackingMethod: 'ga',
			action: trackActions.click,
			category: 'user-login-mobile',
			label,
		});

		window.location.href = href;
	}
});
