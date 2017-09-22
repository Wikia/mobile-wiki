import Ember from 'ember';
import config from '../config/environment';
import fetch from 'fetch';
import mediawikiFetch from '../utils/mediawiki-fetch';
import extend from '../utils/extend';
import {buildUrl, getQueryString} from '../utils/url';
import {getFetchErrorMessage, UserLoadDetailsFetchError, UserLoadInfoFetchError} from '../utils/errors';

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

const {
	Object: EmberObject,
	RSVP,
	inject,
	isArray
} = Ember;

export default EmberObject.extend({
	defaultAvatarSize: 100,
	logger: inject.service(),

	getUserId(accessToken) {
		if (!accessToken) {
			return null;
		}

		const queryString = getQueryString({
			code: accessToken
		});

		return fetch(`${config.helios.internalUrl}${queryString}`, {
			headers: {'X-Wikia-Internal-Request': '1'},
			timeout: config.helios.timeout,
		}).then((response) => {
			if (response.ok) {
				return response.json().then((data) => data.user_id);
			} else {
				if (response.status === 401) {
					this.get('logger').info('Token not authorized by Helios');
				} else {
					this.get('logger').error('Helios connection error: ', response);
				}

				return null;
			}
		}).catch((reason) => {
			if (reason.type === 'request-timeout') {
				this.get('logger').error('Helios timeout error: ', reason);
			} else {
				this.get('logger').error('Helios connection error: ', reason);
			}

			return null;
		});
	},

	/**
	 * @param {UserModelFindParams} params
	 * @returns {Ember.RSVP.Promise<UserModel>}
	 */
	find(params) {
		const avatarSize = params.avatarSize || this.defaultAvatarSize,
			userId = params.userId,
			host = params.host,
			accessToken = params.accessToken || '';

		return RSVP.all([
			this.loadDetails(host, userId, avatarSize),
			this.loadUserInfo(host, accessToken, userId),
		]).then(([userDetails, userInfo]) => {
			const userLanguage = userInfo && userInfo.query.userinfo.options.language;

			let out = {
				avatarPath: null,
				name: null,
				powerUserTypes: null,
				rights: null
			};

			if (userDetails) {
				out = extend(out, this.sanitizeDetails(userDetails));
			}

			if (userLanguage) {
				out.language = userLanguage;
			}

			if (userInfo) {
				const rights = this.getUserRights(userInfo);

				if (rights) {
					out.rights = rights;
				}
			}

			return out;
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
				if (isArray(result.items)) {
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
	 * @returns {Object}
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
	 * @param {QueryUserInfoResponse} query
	 * @returns {Object}
	 */
	getUserRights({query}) {
		const rights = {},
			rightsArray = query.userinfo.rights;

		if (isArray(rightsArray)) {
			// TODO - we could use contains instead of making an object out of an array
			rightsArray.forEach((right) => {
				rights[right] = true;
			});

			return rights;
		}
	},
});
