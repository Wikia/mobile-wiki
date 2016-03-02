import Ember from 'ember';
import LoginLinkMixin from '../mixins/login-link';

export default Ember.Component.extend(
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
