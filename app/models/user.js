import {inject as service} from '@ember/service';
import EmberObject from '@ember/object';
import {all} from 'rsvp';
import {isArray} from '@ember/array';
import config from '../config/environment';
import fetch from 'fetch';
import mediawikiFetch from '../utils/mediawiki-fetch';
import extend from '../utils/extend';
import {buildUrl, getQueryString} from '../utils/url';
import {getFetchErrorMessage, UserLoadDetailsFetchError, UserLoadInfoFetchError} from '../utils/errors';
import getLanguageCodeFromRequest from '../utils/language';

export default EmberObject.extend({
	defaultAvatarSize: 100,
	logger: service(),

	getUserId(accessToken) {
		if (!accessToken) {
			return null;
		}

		const queryString = getQueryString({
			code: accessToken
		});
		const {fastbootOnly: {helios}} = config;

		return fetch(`${helios.internalUrl}${queryString}`, {
			headers: {'X-Wikia-Internal-Request': '1'},
			timeout: helios.timeout,
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
	 * @returns {RSVP.Promise<UserModel>}
	 */
	find(params) {
		const avatarSize = params.avatarSize || this.defaultAvatarSize,
			userId = params.userId,
			host = params.host,
			accessToken = params.accessToken || '',
			langPath = params.langPath;

		return all([
			this.loadDetails(host, userId, avatarSize, langPath),
			this.loadUserInfo(host, accessToken, userId, langPath),
		]).then(([userDetails, userInfo]) => {
			const userLanguage = userInfo && userInfo.query.userinfo.options.language;

			let out = {
				avatarPath: null,
				name: null,
				powerUserTypes: null,
				rights: null
			};

			if (userDetails) {
				out = extend(out, this.sanitizeDetails(userDetails, langPath));
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
	 * @param {string|null} langPath
	 * @returns {RSVP.Promise}
	 */
	loadDetails(host, userId, avatarSize, langPath) {
		const url = buildUrl({
			host,
			langPath,
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
					return getFetchErrorMessage(response).then(() => {
						throw new UserLoadDetailsFetchError({
							code: response.status
						}).withAdditionalData({
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
	 * @param {string|null} langPath
	 * @returns {RSVP.Promise<QueryUserInfoResponse>}
	 */
	loadUserInfo(host, accessToken, userId, langPath) {
		const url = buildUrl({
			host,
			langPath,
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
				return getFetchErrorMessage(response).then(() => {
					throw new UserLoadInfoFetchError({
						code: response.status
					}).withAdditionalData({
						requestUrl: url,
						responseUrl: response.url
					});
				});
			}
		});
	},

	/**
	 * @param {*} userData
	 * @param {string|null} langPath
	 * @returns {Object}
	 */
	sanitizeDetails(userData, langPath) {
		const data = {
			name: userData.name,
			avatarPath: userData.avatar,
			profileUrl: buildUrl({
				langPath,
				namespace: 'User',
				relative: true,
				title: userData.name
			})
		};

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
