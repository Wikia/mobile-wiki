import Ember from 'ember';
import UserModel from '../models/user';
import config from '../config/environment';

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

	initialize() {
		const fastboot = this.get('fastboot');

		if (fastboot.get('isFastBoot')) {
			const accessToken = fastboot.get('request.cookies.access_token');

			if (accessToken) {
				UserModel.getUserId(accessToken).then((userId) => {
					if (userId) {
						fastboot.get('shoebox').put('userId', userId);
						// We have to anonymize user id before sending it to Google
						// It's faster to do the hashing server side and pass to the front-end, ready to use
						fastboot.get('shoebox').put('gaUserIdHash', this.getGaUserIdHash(userId));
						this.initializeUserData(userId);
					}
				});
			}
		} else {
			const userId = fastboot.get('shoebox').retrieve('userId');

			if (userId) {
				this.initializeUserData(userId);
			}
		}
	},

	/**
	 * @returns {void}
	 */
	initializeUserData(userId) {
		this.set('userId', userId);

		if (userId !== null) {
			const shoebox = this.get('fastboot.shoebox');
			if (this.get('fastboot.isFastBoot')) {
				UserModel
					.find({
						accessToken: this.get('fastboot.request.cookies.access_token'),
						userId,
						host: this.get('wikiVariables.host')
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

	getGaUserIdHash(userId) {
		const Crypto = FastBoot.require('crypto');
		const rawString = userId.toString() + config.gaUserSalt;

		return Crypto.createHash('md5').update(rawString).digest('hex');
	}
});
