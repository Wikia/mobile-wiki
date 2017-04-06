import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['wds-avatar-stack'],

	users: [],
	totalCount: 0,
	displayLimit: 5,

	avatars: Ember.computed('users', function () {
		return this.get('users').slice(0, this.get('displayLimit'));
	}),

	avatarOverflow: Ember.computed('users', 'totalCount', function () {
		return this.get('totalCount') - this.get('avatars.length');
	}),

	showAvatarOverflow: Ember.computed.gt('avatarOverflow', 0)

});
