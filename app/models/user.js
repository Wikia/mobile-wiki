import Ember from 'ember';
import config from '../config/environment';
import fetch from 'ember-network/fetch';
import mediawikiFetch from '../utils/mediawiki-fetch';
import {getService} from '../utils/application-instance';
import {buildUrl, getQueryString} from '../utils/url';
import {getFetchErrorMessage, UserLoadDetailsFetchError, UserLoadInfoFetchError} from '../utils/errors';

const {
	Object: EmberObject,
	RSVP
} = Ember;

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

const UserModel = EmberObject.extend({
	avatarPath: null,
	name: null,
	powerUserTypes: null,
	rights: null,
});

UserModel.reopenClass({
	defaultAvatarSize: 100,

	getUserId(accessToken) {
		if (!accessToken) {
			return RSVP.resolve(null);
		}

		const queryString = getQueryString({
			code: accessToken
		});
		const logger = getService('logger');

		return fetch(`${config.helios.internalUrl}${queryString}`, {
			timeout: config.helios.timeout,
		}).then((response) => {
			if (response.ok) {
				return response.json().then((data) => data.user_id);
			} else {
				if (response.status === 401) {
					logger.info('Token not authorized by Helios');
				} else {
					logger.error('Helios connection error: ', response);
				}

				return RSVP.resolve(null);
			}
		}).catch((reason) => {
			if (reason.type === 'request-timeout') {
				logger.error('Helios timeout error: ', reason);
			} else {
				logger.error('Helios connection error: ', reason);
			}

			return RSVP.resolve(null);
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
		const url = buildUrl({
			host,
			path: '/wikia.php',
			query: {
				controller: 'UserApi',
				method: 'getDetails',
				ids: userId,
				size: avatarSize
			}
		});

		return mediawikiFetch(url)
			.then((response) => {
				if (response.ok) {
					return response.json();
				} else {
					return getFetchErrorMessage(response).then((responseBody) => {
						throw new UserLoadDetailsFetchError({
							code: response.status
						}).withAdditionalData({
							responseBody,
							requestUrl: url,
							responseUrl: response.url
						});
					});
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
		const url = buildUrl({
			host,
			path: '/api.php',
			query: {
				action: 'query',
				meta: 'userinfo',
				uiprop: 'rights|options|blockinfo',
				format: 'json',
				ids: userId
			}
		});

		return mediawikiFetch(url, {
			headers: {
				Cookie: `access_token=${accessToken}`
			},
		}).then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				return getFetchErrorMessage(response).then((responseBody) => {
					throw new UserLoadInfoFetchError({
						code: response.status
					}).withAdditionalData({
						responseBody,
						requestUrl: url,
						responseUrl: response.url
					});
				});
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
				relative: true,
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
