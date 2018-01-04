import {gt} from '@ember/object/computed';
import {computed} from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
	classNames: ['wds-avatar-stack'],
	totalCount: 0,
	displayLimit: 5,

	showAvatarOverflow: gt('avatarOverflow', 0),

	avatars: computed('users', function () {
		return this.get('users').slice(0, this.get('displayLimit'));
	}),

	avatarOverflow: computed('users', 'totalCount', function () {
		return this.get('totalCount') - this.get('avatars.length');
	}),

	init() {
		this._super(...arguments);
		this.users = [];
	},
});
