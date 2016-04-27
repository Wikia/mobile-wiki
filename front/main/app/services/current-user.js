import Ember from 'ember';
import UserModel from '../models/user';

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
 * @property {*} options
 */

export default Ember.Service.extend({
	ajax: Ember.inject.service(),
	rights: {},
	isAuthenticated: Ember.computed.bool('userId'),
	isBlocked: false,
	language: Ember.getWithDefault(Mercury, 'wiki.language.content', 'en'),

	userId: Ember.computed(() => {
		const cookieUserId = parseInt(M.prop('userId'), 10);

		return cookieUserId > 0 ? cookieUserId : null;
	}),

	userModel: Ember.computed('userId', function () {
		const userId = this.get('userId');

		if (userId !== null) {
			return UserModel
				.find({userId})
				.catch((err) => {
					Ember.Logger.warn('Couldn\'t load current user model', err);
				});
		}

		return Ember.RSVP.reject();
	}),

	/**
	 * @returns {void}
	 */
	init() {
		this._super(...arguments);
		const userId = this.get('userId');

		if (userId !== null) {
			Ember.RSVP.all([this.get('userModel'), this.loadUserInfo()]).then(([userModel, userInfo]) => {
				if (userModel) {
					this.setProperties(userModel);
				}

				if (userInfo) {
					this.setUserLanguage(userInfo);
					this.setBlockedStatus(userInfo);
					this.setUserRights(userInfo);
				}
			});
		}
	},

	/**
	 * @param {string} query
	 * @returns {void}
	 */
	setUserLanguage({query}) {
		const userLanguage = query.userinfo.options.language;

		if (userLanguage) {
			this.set('language', userLanguage);
		}
	},

	/**
	 * @param {QueryUserInfoResponse} query
	 * @returns {Ember.RSVP.Promise<QueryUserInfoResponse>}
	 */
	setUserRights({query}) {
		const rightsArray = query.userinfo.rights,
			rights = {};

		if (Ember.isArray(rightsArray)) {
			// TODO - we could use contains instead of making an object out of an array
			rightsArray.forEach((right) => {
				rights[right] = true;
			});

			this.set('rights', rights);
		}
	},

	/**
	 * @param {QueryUserInfoResponse} query
	 * @returns {Ember.RSVP.Promise<QueryUserInfoResponse>}
	 */
	setBlockedStatus({query}) {
		const blockId = query.userinfo.blockid;

		if (blockId) {
			this.set('isBlocked', true);
		}
	},

	/**
	 * TODO - move to UserModel | XW-1160
	 * @returns {Ember.RSVP.Promise<QueryUserInfoResponse>}
	 */
	loadUserInfo() {
		return this.get('ajax').request('/api.php', {
			data: {
				action: 'query',
				meta: 'userinfo',
				uiprop: 'rights|options|blockinfo',
				format: 'json'
			},
		});
	}
});
