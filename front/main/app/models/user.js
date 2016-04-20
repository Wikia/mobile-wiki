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
	rights: null,
	powerUserTypes: null
});

UserModel.reopenClass({
	defaultAvatarSize: 100,

	/**
	 * @param {UserModelFindParams} params
	 * @returns {Ember.RSVP.Promise<UserModel>}
	 */
	find(params) {
		const avatarSize = params.avatarSize || UserModel.defaultAvatarSize,
			modelInstance = UserModel.create();

		return UserModel.loadDetails(params.userId, avatarSize)
			.then((userDetails) => {
				const detailsSanitized = UserModel.sanitizeDetails(userDetails);

				return modelInstance.setProperties(detailsSanitized);
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
	}
});

export default UserModel;
