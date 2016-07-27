import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['user-avatar'],

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

	badge: Ember.computed('badgePermission', function() {
		const badgePermission = this.get('badgePermission');
		return badgePermission ? this.get(`badges.${badgePermission}`) : '';
	}),

	profileName: Ember.computed('username', function () {
		const userName = this.get('username') || '';

		return userName.trim();
	}),
	/**
	 * Returns link to the post author's user page
	 * @returns {string}
	 */
	profileUrl: Ember.computed('profileName', function () {
		return M.buildUrl({
			namespace: 'User',
			title: this.get('profileName'),
		});
	}),
	displayName: Ember.computed('profileName', function () {
		return this.get('anonymous') ? i18n.t('app.username-anonymous') : this.get('profileName');
	}),
	shouldWrapInHref: true
});
