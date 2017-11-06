define('mobile-wiki/components/wds-avatar-stack', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var gt = Ember.computed.gt;
	var computed = Ember.computed;
	var Component = Ember.Component;
	exports.default = Component.extend({
		classNames: ['wds-avatar-stack'],

		users: [],
		totalCount: 0,
		displayLimit: 5,

		avatars: computed('users', function () {
			return this.get('users').slice(0, this.get('displayLimit'));
		}),

		avatarOverflow: computed('users', 'totalCount', function () {
			return this.get('totalCount') - this.get('avatars.length');
		}),

		showAvatarOverflow: gt('avatarOverflow', 0)

	});
});