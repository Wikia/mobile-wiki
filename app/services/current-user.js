import {bool} from '@ember/object/computed';
import {computed} from '@ember/object';
import {getOwner} from '@ember/application';
import Service, {inject as service} from '@ember/service';
import {resolve} from 'rsvp';
import UserModel from '../models/user';
import config from '../config/environment';

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
	fastboot: service(),
	logger: service(),
	wikiVariables: service(),
	rights: null,
	isAuthenticated: bool('userId'),
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

				return UserModel.create(getOwner(this).ownerInjection())
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
						if (err.code !== 404) {
							this.get('logger').error('Couldn\'t load current user model', err);
						}
					});
			} else {
				this.setProperties(shoebox.retrieve('userData'));
			}
		}

		return resolve();
	},

	getGaUserIdHash() {
		const Crypto = FastBoot.require('crypto');
		const rawString = `${this.get('userId')}${config.fastbootOnly.gaUserSalt}`;

		return Crypto.createHash('md5').update(rawString).digest('hex');
	}
});
