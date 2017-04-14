import Ember from 'ember';
import config from '../config/environment';
import fetch from 'ember-network/fetch';
import {buildUrl, getQueryString} from '../utils/url';
import {UserLoadDetailsFetchError, UserLoadInfoFetchError} from '../errors/main'

/**
 * @typedef {Object} UserModelFindParams
 * @property {number} userId
 * @property {string} host
 * @property {string} [accessToken]
 * @property {number} [avatarSize]
 */

/**
 * @typedef {Object} UserProperties
 * @property {string} avatarPath
 * @property {string} name
 * @property {string} profileUrl
 * @property {number} userId
 */

const UserModel = Ember.Object.extend({
	avatarPath: null,
	name: null,
	powerUserTypes: null,
	rights: null,
});

UserModel.reopenClass({
	defaultAvatarSize: 100,

	getUserId(accessToken) {
		const queryString = getQueryString({
			code: accessToken
		});

		return fetch(`${config.helios.internalUrl}${queryString}`, {
			timeout: config.helios.timeout,
		}).then((response) => {
			if (response.ok) {
				return response.json().then((data) => {
					return data.user_id;
				});
			} else {
				if (response.status === 401) {
					Ember.Logger.info('Token not authorized by Helios');
				} else {
					Ember.Logger.error('Helios connection error: ', response);
				}
			}
		}).catch((reason) => {
			if (reason.type === 'request-timeout') {
				Ember.Logger.error('Helios timeout error: ', reason);
			} else {
				Ember.Logger.error('Helios connection error: ', reason);
			}
		});
	},

	/**
	 * @param {UserModelFindParams} params
	 * @returns {Ember.RSVP.Promise<UserModel>}
	 */
	find(params) {
		const avatarSize = params.avatarSize || UserModel.defaultAvatarSize,
			modelInstance = UserModel.create(),
			userId = params.userId,
			host = params.host,
			accessToken = params.accessToken || '';

		return Ember.RSVP.all([
			this.loadDetails(host, userId, avatarSize),
			this.loadUserInfo(host, accessToken, userId),
		]).then(([userDetails, userInfo]) => {
			if (userDetails) {
				modelInstance.setProperties(UserModel.sanitizeDetails(userDetails));
			}

			if (userInfo) {
				UserModel.setUserLanguage(modelInstance, userInfo);
				UserModel.setUserRights(modelInstance, userInfo);
			}

			return modelInstance;
		});
	},

	/**
	 * @param {string} host
	 * @param {number} userId
	 * @param {number} avatarSize
	 * @returns {Ember.RSVP.Promise}
	 */
	loadDetails(host, userId, avatarSize) {
		return fetch(buildUrl({
			host,
			path: '/wikia.php',
			query: {
				controller: 'UserApi',
				method: 'getDetails',
				ids: userId,
				size: avatarSize
			}
		}))
			.then((response) => {
				if (response.ok) {
					return response.json()
				} else {
					return response.text().then((responseBody) => {
						throw new UserLoadDetailsFetchError().withAdditionalData({
							host,
							responseBody,
							url: response.url
						});
					})
				}
			})
			.then((result) => {
				if (Ember.isArray(result.items)) {
					return result.items[0];
				} else {
					throw new Error(result);
				}
			});
	},

	/**
	 * @param {string} host
	 * @param {string} accessToken
	 * @param {number} userId
	 * @returns {Ember.RSVP.Promise<QueryUserInfoResponse>}
	 */
	loadUserInfo(host, accessToken, userId) {
		return fetch(buildUrl({
			host,
			path: '/api.php',
			query: {
				action: 'query',
				meta: 'userinfo',
				uiprop: 'rights|options|blockinfo',
				format: 'json',
				ids: userId
			}
		}), {
			headers: {
				Cookie: `access_token=${accessToken}`
			},
		}).then((response) => {
			if (response.ok) {
				return response.json()
			} else {
				return response.text().then((responseBody) => {
					throw new UserLoadInfoFetchError().withAdditionalData({
						host,
						responseBody,
						url: response.url
					});
				})
			}
		});
	},

	/**
	 * @param {*} userData
	 * @returns {UserProperties}
	 */
	sanitizeDetails(userData) {
		const data = {
			name: userData.name,
			avatarPath: userData.avatar,
			profileUrl: buildUrl({
				namespace: 'User',
				title: userData.name
			})
		};

		if (userData.poweruser_types) {
			data.powerUserTypes = userData.poweruser_types;
		}

		return data;
	},

	/**
	 * @param {Ember.Object} model
	 * @param {string} query
	 * @returns {void}
	 */
	setUserLanguage(model, {query}) {
		const userLanguage = query.userinfo.options.language;

		if (userLanguage) {
			model.set('language', userLanguage);
		}
	},

	/**
	 * @param {Ember.Object} model
	 * @param {QueryUserInfoResponse} query
	 * @returns {void}
	 */
	setUserRights(model, {query}) {
		const rights = {},
			rightsArray = query.userinfo.rights;

		if (Ember.isArray(rightsArray)) {
			// TODO - we could use contains instead of making an object out of an array
			rightsArray.forEach((right) => {
				rights[right] = true;
			});

			model.set('rights', rights);
		}
	},
});

export default UserModel;
