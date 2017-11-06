define('mobile-wiki/components/login-icon', ['exports', 'mobile-wiki/mixins/login-link'], function (exports, _loginLink) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend(_loginLink.default, {
		tagName: 'a',
		classNames: ['external', 'login'],

		/**
   * @returns {void}
   */
		click: function click() {
			this.goToLogin();
		}
	});
});