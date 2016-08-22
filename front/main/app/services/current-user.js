import Ember from 'ember';
import UserModel from '../models/user';

/**
 * @typedef {Object} QueryUserInfoResponse
 * @property {QueryUserInfoResponseQuery} query
 */

/**
 * @typedef {Object} QueryUserInfoResponseQuery
 * @property {QueryUserInfoResponseQueryUserInfo} userinfo
 */

/**
 * @typedef {Object} QueryUserInfoResponseQueryUserInfo
 * @property {string} [anon]
 * @property {number} id
 * @property {string} name
 * @property {string[]} rights
 * @property {Ember.Object} permissions
 * @property {*} options
 */

export default Ember.Service.extend({
	ajax: Ember.inject.service(),
	rights: {},
	isAuthenticated: Ember.computed.bool('userId'),
	isBlocked: false,
	language: Ember.getWithDefault(Mercury, 'wiki.language.content', 'en'),

	userId: Ember.computed(() => {
		const cookieUserId = parseInt(M.prop('userId'), 10);

		return cookieUserId > 0 ? cookieUserId : null;
	}),

	userModel: Ember.computed('userId', function () {
		const userId = this.get('userId');

		if (userId !== null) {
			return UserModel
				.find({userId})
				.catch((err) => {
					Ember.Logger.warn('Couldn\'t load current user model', err);
				});
		}

		return Ember.RSVP.reject();
	}),

	/**
	 * @returns {void}
	 */
	init() {
		this._super(...arguments);
		const userId = this.get('userId');

		if (userId !== null) {
			this.get('userModel').then((userModel) => {
				if (userModel) {
					this.setProperties(userModel);
				}
			});
		}
	},
});
