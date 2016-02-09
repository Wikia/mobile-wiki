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
	rights: {},
	isAuthenticated: Ember.computed.bool('userId'),
	language: null,

	userId: Ember.computed(() => {
		const cookieUserId = parseInt(M.prop('userId'), 10);

		return cookieUserId > 0 ? cookieUserId : null;
	}),

	/**
	 * @returns {void}
	 */
	init() {
		const userId = this.get('userId');

		if (userId !== null) {
			UserModel.find({userId})
				.then((result) => {
					this.setProperties(result);
				})
				.catch((err) => {
					Ember.Logger.warn('Couldn\'t load current user model', err);
				});

			this.loadUserInfo()
				.then(this.loadUserLanguage.bind(this))
				.then(this.loadUserRights.bind(this))
				.catch((err) => {
					this.setUserLanguage();
					Ember.Logger.warn('Couldn\'t load current user info', err);
				});
		} else {
			this.setUserLanguage();
		}

		this._super();
	},

	/**
	 * @param {string|null} [userLang=null]
	 * @returns {void}
	 */
	setUserLanguage(userLang = null) {
		const contentLanguage = Ember.getWithDefault(Mercury, 'wiki.language.content', 'en'),
			userLanguage = userLang || contentLanguage;

		this.set('language', userLanguage);
		M.prop('userLanguage', userLanguage);
	},

	/**
	 * @param {QueryUserInfoResponse} result
	 * @returns {Ember.RSVP.Promise<QueryUserInfoResponse>}
	 */
	loadUserLanguage(result) {
		return new Ember.RSVP.Promise((resolve) => {
			const userLanguage = Ember.get(result, 'query.userinfo.options.language');

			this.setUserLanguage(userLanguage);

			resolve(result);
		});
	},

	/**
	 * @param {QueryUserInfoResponse} result
	 * @returns {Ember.RSVP.Promise<QueryUserInfoResponse>}
	 */
	loadUserRights(result) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			const rightsArray = Ember.get(result, 'query.userinfo.rights'),
				rights = {};

			if (!Ember.isArray(rightsArray)) {
				reject(result);
			}

			rightsArray.forEach((right) => {
				rights[right] = true;
			});

			this.set('rights', rights);

			resolve(result);
		});
	},

	/**
	 * @returns {Ember.RSVP.Promise<QueryUserInfoResponse>}
	 */
	loadUserInfo() {
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.ajax({
				url: '/api.php',
				data: {
					action: 'query',
					meta: 'userinfo',
					uiprop: 'rights|options',
					format: 'json'
				},
				dataType: 'json',
				success: resolve,
				error: reject
			});
		});
	}
});
