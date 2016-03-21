import Ember from 'ember';
import {getDomain} from '../utils/domain';

/**
 * Banner sticked to the bottom of page.
 * It's displayed when 'loaded' class is added and hidden on 'dismissed' class addition.
 */
export default Ember.Mixin.create({
	classNames: ['bottom-banner'],
	classNameBindings: ['loaded', 'dismissed'],
	dismissed: false,
	loaded: false,

	/**
	 * Set cookie with given value
	 *
	 * @param {string} cookieName
	 * @param {string|int} cookieValue
	 * @param {string} expires - cookie expiration time provided in days
	 * @returns {void}
	 */
	setCookie(cookieName, cookieValue, expires) {
		Ember.$.cookie(cookieName, cookieValue, {
			domain: getDomain(),
			expires,
			path: '/'
		});
	}
});
