import Ember from 'ember';
import UserModel from '../models/user';
import M from '../mmm';

const {computed, Service, inject, Logger, RSVP} = Ember;

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

export default Service.extend({
	ajax: inject.service(),
	wikiVariables: inject.service(),
	rights: {},
	isAuthenticated: computed.bool('userId'),
	language: computed('wikiVariables', function () {
		return this.get('wikiVariables.language.content') || 'en';
	}),

	userId: computed(() => {
		const cookieUserId = parseInt(M.prop('userId'), 10);

		return cookieUserId > 0 ? cookieUserId : null;
	}),

	userModel: computed('userId', function () {
		const userId = this.get('userId');

		if (userId !== null) {
			return UserModel
				.find({userId})
				.catch((err) => {
					Logger.warn('Couldn\'t load current user model', err);
				});
		}

		return RSVP.reject();
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
