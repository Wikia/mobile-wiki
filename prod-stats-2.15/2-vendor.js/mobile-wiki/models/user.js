define('mobile-wiki/models/user', ['exports', 'mobile-wiki/config/environment', 'fetch', 'mobile-wiki/utils/mediawiki-fetch', 'mobile-wiki/utils/extend', 'mobile-wiki/utils/url', 'mobile-wiki/utils/errors'], function (exports, _environment, _fetch, _mediawikiFetch, _extend, _url, _errors) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _slicedToArray = function () {
		function sliceIterator(arr, i) {
			var _arr = [];
			var _n = true;
			var _d = false;
			var _e = undefined;

			try {
				for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
					_arr.push(_s.value);

					if (i && _arr.length === i) break;
				}
			} catch (err) {
				_d = true;
				_e = err;
			} finally {
				try {
					if (!_n && _i["return"]) _i["return"]();
				} finally {
					if (_d) throw _e;
				}
			}

			return _arr;
		}

		return function (arr, i) {
			if (Array.isArray(arr)) {
				return arr;
			} else if (Symbol.iterator in Object(arr)) {
				return sliceIterator(arr, i);
			} else {
				throw new TypeError("Invalid attempt to destructure non-iterable instance");
			}
		};
	}();

	var EmberObject = Ember.Object,
	    RSVP = Ember.RSVP,
	    inject = Ember.inject,
	    isArray = Ember.isArray;
	exports.default = EmberObject.extend({
		defaultAvatarSize: 100,
		logger: inject.service(),

		getUserId: function getUserId(accessToken) {
			var _this = this;

			if (!accessToken) {
				return null;
			}

			var queryString = (0, _url.getQueryString)({
				code: accessToken
			});

			return (0, _fetch.default)('' + _environment.default.helios.internalUrl + queryString, {
				headers: { 'X-Wikia-Internal-Request': '1' },
				timeout: _environment.default.helios.timeout
			}).then(function (response) {
				if (response.ok) {
					return response.json().then(function (data) {
						return data.user_id;
					});
				} else {
					if (response.status === 401) {
						_this.get('logger').info('Token not authorized by Helios');
					} else {
						_this.get('logger').error('Helios connection error: ', response);
					}

					return null;
				}
			}).catch(function (reason) {
				if (reason.type === 'request-timeout') {
					_this.get('logger').error('Helios timeout error: ', reason);
				} else {
					_this.get('logger').error('Helios connection error: ', reason);
				}

				return null;
			});
		},


		/**
   * @param {UserModelFindParams} params
   * @returns {Ember.RSVP.Promise<UserModel>}
   */
		find: function find(params) {
			var _this2 = this;

			var avatarSize = params.avatarSize || this.defaultAvatarSize,
			    userId = params.userId,
			    host = params.host,
			    accessToken = params.accessToken || '';

			return RSVP.all([this.loadDetails(host, userId, avatarSize), this.loadUserInfo(host, accessToken, userId)]).then(function (_ref) {
				var _ref2 = _slicedToArray(_ref, 2),
				    userDetails = _ref2[0],
				    userInfo = _ref2[1];

				var userLanguage = userInfo && userInfo.query.userinfo.options.language;

				var out = {
					avatarPath: null,
					name: null,
					powerUserTypes: null,
					rights: null
				};

				if (userDetails) {
					out = (0, _extend.default)(out, _this2.sanitizeDetails(userDetails));
				}

				if (userLanguage) {
					out.language = userLanguage;
				}

				if (userInfo) {
					var rights = _this2.getUserRights(userInfo);

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
		loadDetails: function loadDetails(host, userId, avatarSize) {
			var url = (0, _url.buildUrl)({
				host: host,
				path: '/wikia.php',
				query: {
					controller: 'UserApi',
					method: 'getDetails',
					ids: userId,
					size: avatarSize
				}
			});

			return (0, _mediawikiFetch.default)(url).then(function (response) {
				if (response.ok) {
					return response.json();
				} else {
					return (0, _errors.getFetchErrorMessage)(response).then(function (responseBody) {
						throw new _errors.UserLoadDetailsFetchError({
							code: response.status
						}).withAdditionalData({
							responseBody: responseBody,
							requestUrl: url,
							responseUrl: response.url
						});
					});
				}
			}).then(function (result) {
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
		loadUserInfo: function loadUserInfo(host, accessToken, userId) {
			var url = (0, _url.buildUrl)({
				host: host,
				path: '/api.php',
				query: {
					action: 'query',
					meta: 'userinfo',
					uiprop: 'rights|options|blockinfo',
					format: 'json',
					ids: userId
				}
			});

			return (0, _mediawikiFetch.default)(url, {
				headers: {
					Cookie: 'access_token=' + accessToken
				}
			}).then(function (response) {
				if (response.ok) {
					return response.json();
				} else {
					return (0, _errors.getFetchErrorMessage)(response).then(function (responseBody) {
						throw new _errors.UserLoadInfoFetchError({
							code: response.status
						}).withAdditionalData({
							responseBody: responseBody,
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
		sanitizeDetails: function sanitizeDetails(userData) {
			var data = {
				name: userData.name,
				avatarPath: userData.avatar,
				profileUrl: (0, _url.buildUrl)({
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
		getUserRights: function getUserRights(_ref3) {
			var query = _ref3.query;

			var rights = {},
			    rightsArray = query.userinfo.rights;

			if (isArray(rightsArray)) {
				// TODO - we could use contains instead of making an object out of an array
				rightsArray.forEach(function (right) {
					rights[right] = true;
				});

				return rights;
			}
		}
	});
});