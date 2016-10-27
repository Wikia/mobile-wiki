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
			icon: 'wds-avatar-badges-helper',
			tooltip: i18n.t('main.user-avatar-badge-helper-tooltip', {ns: 'discussion'})
		},
		'badge:staff': {
			icon: 'wds-avatar-badges-staff',
			tooltip: i18n.t('main.user-avatar-badge-staff-tooltip', {ns: 'discussion'})
		},
		'badge:sysop': {
			icon: 'wds-avatar-badges-admin',
			tooltip: i18n.t('main.user-avatar-badge-admin-tooltip', {ns: 'discussion'})
		},
		'badge:threadmoderator': {
			icon: 'wds-avatar-badges-discussion-moderator',
			tooltip: i18n.t('main.user-avatar-badge-moderator-tooltip', {ns: 'discussion'})
		},
		'badge:vstf': {
			icon: 'wds-avatar-badges-vstf',
			tooltip: i18n.t('main.user-avatar-badge-vstf-tooltip', {ns: 'discussion'})
		}
	},

	badge: Ember.computed('badgePermission', function () {
		const badgePermission = this.get('badgePermission');
		return this.getWithDefault(`badges.${badgePermission}`, null);
	})
});
