import Ember from 'ember';
import UserModel from '../models/user';
import config from '../config/environment';

const {computed, Service, inject, RSVP} = Ember;

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
	fastboot: inject.service(),
	logger: inject.service(),
	wikiVariables: inject.service(),
	rights: {},
	isAuthenticated: computed.bool('userId'),
	language: computed('wikiVariables', function () {
		return this.get('wikiVariables.language.content') || 'en';
	}),

	userId: null,

	/**
	 * @returns {RSVP}
	 */
	initializeUserData(userId, host = null) {
		this.set('userId', userId);

		if (userId !== null) {
			const shoebox = this.get('fastboot.shoebox');

			if (this.get('fastboot.isFastBoot')) {
				// We have to anonymize user id before sending it to Google
				// It's faster to do the hashing server side and pass to the front-end, ready to use
				shoebox.put('gaUserIdHash', this.getGaUserIdHash(userId));

				return UserModel
					.find({
						accessToken: this.get('fastboot.request.cookies.access_token'),
						userId,
						host
					})
					.then((userModelData) => {
						if (userModelData) {
							this.setProperties(userModelData);
							shoebox.put('userData', userModelData);
						}
					})
					.catch((err) => {
						this.get('logger').error('Couldn\'t load current user model', err);
					});
			} else {
				this.setProperties(shoebox.retrieve('userData'));
			}
		}

		return RSVP.resolve();
	},

	getGaUserIdHash(userId) {
		const Crypto = FastBoot.require('crypto');
		const rawString = userId.toString() + config.gaUserSalt;

		return Crypto.createHash('md5').update(rawString).digest('hex');
	}
});
