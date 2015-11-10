import Ember from 'ember';

const LoginIconComponent = Ember.Component.extend(LanguagesMixin, {
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

		M.track({
			trackingMethod: 'ga',
			action: M.trackActions.click,
			category: 'user-login-mobile',
			label,
		});

		window.location.href = href;
	},
});

export default LoginIconComponent;
