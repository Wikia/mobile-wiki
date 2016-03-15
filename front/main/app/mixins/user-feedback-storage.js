import Ember from 'ember';
import {getDomain} from '../utils/domain';

export default Ember.Mixin.create({
	/**
	 * Increments a given counter stored in a cookie. Used for cross-wiki impressions and interactions.
	 * @param {string} cookieName
	 * @returns {void}
	 */
	incrementCookieCounter(cookieName) {
		const cookieValue = this.getCookieCounter(cookieName);

		Ember.$.cookie(cookieName, cookieValue + 1, {path: '/', domain: getDomain(), expires: 14});
	},
	/**
	 * Returns the current value of a given counter.
	 * @param {string} cookieName
	 * @returns {Number|number}
     */
	getCookieCounter(cookieName) {
		return parseInt(Ember.$.cookie(cookieName)) || 0;
	},
	/**
	 * Uses the UserFeedbackStorageApi to retrieve an anti-CSRF token for a user.
	 * @returns {Ember.RSVP.Promise}
	 */
	getCSRFToken() {
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.getJSON(
				M.buildUrl({path: '/wikia.php'}),
				{
					controller: 'UserFeedbackStorageApi',
					method: 'getEditToken'
				},
				(response) => {
					if (response.token) {
						resolve(response.token);
					} else {
						reject();
					}
				}
			).fail(reject);
		});
	},
	/**
	 * Saves user feedback using the UserFeedbackStorageApi.
	 * A failure of the request should fail silently, we do not want to break a user's flow with an error.
	 * @param {Object} data
	 * @returns {void}
	 */
	saveUserFeedback(data) {
		this.getCSRFToken()
			.then((token) => {
				data.token = token;

				Ember.$.ajax({
					method: 'POST',
					url: M.buildUrl({
						path: '/wikia.php',
						query: {
							controller: 'UserFeedbackStorageApi',
							method: 'saveUserFeedback'
						}
					}),
					dataType: 'json',
					data,
					success: () => {
						this.incrementCookieCounter('userFeedbackCount');
					}
				});
			});
	}
});
