define('mobile-wiki/components/user-avatar', ['exports', 'mobile-wiki/utils/url'], function (exports, _url) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var Component = Ember.Component;
	var computed = Ember.computed;
	exports.default = Component.extend({
		i18n: service(),
		classNames: ['user-avatar'],
		profileName: computed('username', function () {
			var userName = this.get('username') || '';

			return userName.trim();
		}),
		/**
   * Returns link to the post author's user page
   * @returns {string}
   */
		profileUrl: computed('profileName', function () {
			return (0, _url.buildUrl)({
				namespace: 'User',
				relative: true,
				title: this.get('profileName')
			});
		}),
		displayName: computed('profileName', function () {
			return this.get('anonymous') ? this.get('i18n').t('app.username-anonymous') : this.get('profileName');
		}),
		shouldWrapInHref: true
	});
});