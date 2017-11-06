define('mobile-wiki/services/current-user', ['exports', 'mobile-wiki/models/user', 'mobile-wiki/config/environment'], function (exports, _user, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var bool = Ember.computed.bool;
	var computed = Ember.computed;
	var getOwner = Ember.getOwner;
	var Service = Ember.Service;
	var service = Ember.inject.service;
	var resolve = Ember.RSVP.resolve;
	exports.default = Service.extend({
		fastboot: service(),
		logger: service(),
		wikiVariables: service(),
		rights: {},
		isAuthenticated: bool('userId'),
		language: computed('wikiVariables', function () {
			return this.get('wikiVariables.language.content') || 'en';
		}),

		userId: null,

		/**
   * @returns {RSVP}
   */
		initializeUserData: function initializeUserData(userId) {
			var _this = this;

			var host = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			this.set('userId', userId);

			if (userId !== null) {
				var shoebox = this.get('fastboot.shoebox');

				if (this.get('fastboot.isFastBoot')) {
					// We have to anonymize user id before sending it to Google
					// It's faster to do the hashing server side and pass to the front-end, ready to use
					shoebox.put('gaUserIdHash', this.getGaUserIdHash(userId));

					return _user.default.create(getOwner(this).ownerInjection()).find({
						accessToken: this.get('fastboot.request.cookies.access_token'),
						userId: userId,
						host: host
					}).then(function (userModelData) {
						if (userModelData) {
							_this.setProperties(userModelData);

							shoebox.put('userData', userModelData);
						}
					}).catch(function (err) {
						_this.get('logger').error('Couldn\'t load current user model', err);
					});
				} else {
					this.setProperties(shoebox.retrieve('userData'));
				}
			}

			return resolve();
		},
		getGaUserIdHash: function getGaUserIdHash(userId) {
			var Crypto = FastBoot.require('crypto');
			var rawString = userId.toString() + _environment.default.gaUserSalt;

			return Crypto.createHash('md5').update(rawString).digest('hex');
		}
	});
});