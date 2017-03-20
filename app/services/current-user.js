import Ember from 'ember';
import UserModel from '../models/user';

const {computed, Service, inject, Logger} = Ember;

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
	wikiVariables: inject.service(),
	fastboot: inject.service(),
	rights: {},
	isAuthenticated: computed.bool('userId'),
	language: computed('wikiVariables', function () {
		return this.get('wikiVariables.language.content') || 'en';
	}),

	userId: null,

	/**
	 * @returns {void}
	 */
	initializeUserData(userId) {
		this._super(...arguments);

		this.set('userId', userId);

		if (userId !== null) {
			const shoebox = this.get('fastboot.shoebox');
			if (this.get('fastboot.isFastBoot')) {
				UserModel
					.find({
						accessToken: this.get('fastboot.cookies.access_token'),
						userId,
						host: 'fallout.damian.wikia-dev.pl'
					})
					.then((userModelData) => {
						if (userModelData) {
							this.setProperties(userModelData);
							shoebox.put('userData', userModelData);
						}
					})
					.catch((err) => {
						Logger.warn('Couldn\'t load current user model', err);
					});
			} else {
				this.setProperties(shoebox.retrieve('userData'));
			}
		}
	},
});
