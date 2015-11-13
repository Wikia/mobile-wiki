
import Mercury from '../../mercury/Mercury';
import LanguagesMixin from './login-icon';
import {track, trackActions} from '../../mercury/utils/track';

const LoginIconComponent = Ember.Component.extend(
	LanguagesMixin,
	{
		tagName: 'a',
		classNames: ['external', 'login'],

		/**
		 * @returns {void}
		 */
		click() {
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
		},
	}
);

export default LoginIconComponent;
