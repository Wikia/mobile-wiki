import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'figure',
	classNames: ['user-avatar-badge'],

	/**
	 * User badge permission that will be translated to user avatar badge.
	 *
	 * @public
	 */
	badgePermission: null,

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
		return this.getWithDefault(`badges.${badgePermission}`, null);
	})
});
