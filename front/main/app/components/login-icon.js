import Ember from 'ember';
import LoginLinkMixin from '../mixins/login-link';
import {track, trackActions} from 'common/utils/track';

export default Ember.Component.extend(
	LoginLinkMixin,
	{
		tagName: 'a',
		classNames: ['external', 'login'],

		/**
		 * @returns {void}
		 */
		click() {
			track({
				trackingMethod: 'ga',
				action: trackActions.click,
				category: 'user-login-mobile',
				label: 'join-link',
			});
			this.goToLogin();
		},
	}
);
