import Ember from 'ember';
import request from 'ember-ajax/request';
import DiscussionUserPermissions from './user-permissions/domain/discussions';

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
	permissions: null,
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
			this.loadUserPermissions(userId)
		]).then(([userDetails, userInfo, userPermissions]) => {
			if (userDetails) {
				modelInstance.setProperties(UserModel.sanitizeDetails(userDetails));
			}

			if (userInfo) {
				UserModel.setUserLanguage(modelInstance, userInfo);
				UserModel.setBlockedStatus(modelInstance, userInfo);
				UserModel.setUserRights(modelInstance, userInfo);
			}

			if (userPermissions[0]) {
				UserModel.setNormalizedPermissions(modelInstance, userPermissions[0].permissions);
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
	 * @param {number} userId
	 * @returns {Ember.RSVP.Promise}
	 */
	loadUserPermissions(userId) {
		const url = M.getUserPermissionsServiceUrl(`/permissions/wiki/${Mercury.wiki.id}/scope/discussions/bulkUsers`);

		return request(url, {
			data: {
				uid: userId
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
	 * @param {Object} permissionsData
	 * @returns {void}
	 */
	setNormalizedPermissions(model, permissionsData) {
		if (!permissionsData) {
			return;
		}

		const permissions = Ember.Object.create();

		if (permissionsData.discussions) {
			permissions.set('discussions', DiscussionUserPermissions.create(permissionsData.discussions));
		}

		model.set('permissions', permissions);
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
		const rightsArray = query.userinfo.rights,
			rights = {};

		if (Ember.isArray(rightsArray)) {
			// TODO - we could use contains instead of making an object out of an array
			rightsArray.forEach((right) => {
				rights[right] = true;
			});

			model.set('rights', rights);
		}
	},

	/**
	 * @param {Ember.Object} model
	 * @param {QueryUserInfoResponse} query
	 * @returns {Ember.RSVP.Promise<QueryUserInfoResponse>}
	 */
	setBlockedStatus(model, {query}) {
		const blockId = query.userinfo.blockid;

		if (blockId) {
			model.set('isBlocked', true);
		}
	},
});

export default UserModel;
