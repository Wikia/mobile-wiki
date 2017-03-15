import Ember from 'ember';
import request from 'ember-ajax/request';

/**
 * @typedef {Object} UserModelFindParams
 * @property {number} userId
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

	/**
	 * @param {UserModelFindParams} params
	 * @returns {Ember.RSVP.Promise<UserModel>}
	 */
	find(params) {
		const avatarSize = params.avatarSize || UserModel.defaultAvatarSize,
			modelInstance = UserModel.create(),
			userId = params.userId;

		return Ember.RSVP.all([
			this.loadDetails(userId, avatarSize),
			this.loadUserInfo(userId),
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
	 * @param {number} userId
	 * @param {number} avatarSize
	 * @returns {Ember.RSVP.Promise}
	 */
	loadDetails(userId, avatarSize) {
		return request(M.buildUrl({path: '/wikia.php'}), {
			data: {
				controller: 'UserApi',
				method: 'getDetails',
				ids: userId,
				size: avatarSize
			},
		}).then((result) => {
			if (Ember.isArray(result.items)) {
				return result.items[0];
			} else {
				throw new Error(result);
			}
		});
	},

	/**
	 * @param {number} userId
	 * @returns {Ember.RSVP.Promise<QueryUserInfoResponse>}
	 */
	loadUserInfo(userId) {
		return request(M.buildUrl({path: '/api.php'}), {
			data: {
				action: 'query',
				meta: 'userinfo',
				uiprop: 'rights|options|blockinfo',
				format: 'json',
				ids: userId
			},
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
			profileUrl: M.buildUrl({
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
