import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'figure',
	classNames: ['user-avatar-badge'],

	badges: {
		'badge:helper': {
			icon: 'badge-helper',
			tooltip: 'Helpers'
		},
		'badge:staff': {
			icon: 'badge-wikia-staff',
			tooltip: 'Wikia Staff'
		},
		'badge:sysop': {
			icon: 'badge-admin',
			tooltip: 'Community Admin'
		},
		'badge:threadmoderator': {
			icon: 'badge-discussion-moderator',
			tooltip: 'Discussion Moderator'
		},
		'badge:vstf': {
			icon: 'badge-vstf',
			tooltip: 'VSTF'
		}
	},

	badge: Ember.computed('badgePermission', function () {
		const badgePermission = this.get('badgePermission');
		return badgePermission ? this.get(`badges.${badgePermission}`) : '';
	})
});
