import Component from '@ember/component';
import LoginLinkMixin from '../mixins/login-link';

export default Component.extend(
	LoginLinkMixin,
	{
		tagName: 'a',
		classNames: ['external', 'login'],

		/**
		 * @returns {void}
		 */
		click() {
			this.goToLogin();
		},
	}
);
