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

App.CurrentUser = Em.Object.extend({
	rights: {},
	isAuthenticated: Em.computed.bool('userId'),
	language: null,

	userId: Em.computed(() => {
		const cookieUserId = parseInt(M.prop('userId'), 10);

		return cookieUserId > 0 ? cookieUserId : null;
	}),

	/**
	 * @returns {void}
	 */
	init() {
		const userId = this.get('userId');

		if (userId !== null) {
			App.UserModel.find({userId})
				.then((result) => {
					this.setProperties(result);
				})
				.catch((err) => {
					Em.Logger.warn('Couldn\'t load current user model', err);
				});

			this.loadUserInfo()
				.then(this.loadUserLanguage.bind(this))
				.then(this.loadUserRights.bind(this))
				.catch((err) => {
					this.setUserLanguage();
					Em.Logger.warn('Couldn\'t load current user info', err);
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
		const contentLanguage = Em.getWithDefault(Mercury, 'wiki.language.content', 'en'),
			userLanguage = userLang || contentLanguage;

		this.set('language', userLanguage);
		M.prop('userLanguage', userLanguage);
	},

	/**
	 * @param {QueryUserInfoResponse} result
	 * @returns {Em.RSVP.Promise<QueryUserInfoResponse>}
	 */
	loadUserLanguage(result) {
		return new Em.RSVP.Promise((resolve) => {
			const userLanguage = Em.get(result, 'query.userinfo.options.language');

			this.setUserLanguage(userLanguage);

			resolve(result);
		});
	},

	/**
	 * @param {QueryUserInfoResponse} result
	 * @returns {Em.RSVP.Promise<QueryUserInfoResponse>}
	 */
	loadUserRights(result) {
		return new Em.RSVP.Promise((resolve, reject) => {
			const rightsArray = Em.get(result, 'query.userinfo.rights'),
				rights = {};

			if (!Em.isArray(rightsArray)) {
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
	 * @returns {Em.RSVP.Promise<QueryUserInfoResponse>}
	 */
	loadUserInfo() {
		return new Em.RSVP.Promise((resolve, reject) => {
			Em.$.ajax({
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
