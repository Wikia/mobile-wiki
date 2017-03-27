import Ember from 'ember';
import config from '../config/environment';
import request from 'ember-ajax/request';
import {isTimeoutError} from 'ember-ajax/errors';
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

	initialize() {
		const fastboot = this.get('fastboot');

		if (fastboot.get('isFastBoot')) {
			const accessToken = fastboot.get('request.cookies.access_token');

			if (accessToken) {
				request(config.helios.internalUrl, {
					data: {
						code: accessToken
					},
					timeout: config.helios.timeout,
					error: false
				}).then((data) => {
					fastboot.get('shoebox').put('userId', data.user_id);
					this.initializeUserData(data.user_id);
				}).catch((reason) => {
					if (isTimeoutError(reason)) {
						Logger.error('Helios timeout error: ', reason);
					} else if (reason.errors && reason.errors[0].status == 401) {
						Logger.info('Token not authorized by Helios: ', reason);
					} else {
						Logger.error('Helios connection error: ', reason);
					}
				})
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
});
