define('mobile-wiki/mixins/login-link', ['exports', 'mobile-wiki/mixins/languages', 'mobile-wiki/utils/track'], function (exports, _languages, _track) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Mixin = Ember.Mixin;
	exports.default = Mixin.create(_languages.default, {
		/**
   * Creates a link to a login page preserving current page as a redirect
   * and adding a language code to the querystring
   * @returns {void}
   */
		goToLogin: function goToLogin(redirectUrl) {
			(0, _track.track)({
				trackingMethod: 'ga',
				action: _track.trackActions.click,
				category: 'user-login-mobile',
				label: 'join-link'
			});

			var url = redirectUrl || window.location.href;

			window.location.href = '/join?redirect=' + encodeURIComponent(url) + this.getUselangParam();
		},


		actions: {
			goToLogin: function goToLogin() {
				this.goToLogin.apply(this, arguments);
			}
		}
	});
});