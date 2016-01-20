import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['user-menu'],
	classNameBindings: ['shouldBeVisible:visible:collapsed'],

	currentUser: Ember.inject.service(),

	isVisible: Ember.computed.bool('currentUser.isAuthenticated'),

	links: Ember.computed('currentUser.name', function () {
		return [
			{
				href: M.buildUrl({
					namespace: 'User',
					title: this.get('currentUser.name'),
				}),
				textKey: 'user-menu-profile',
			},
			{
				href: M.buildUrl({
					namespace: 'Special',
					title: 'UserLogout',
				}),
				textKey: 'user-menu-log-out',
			}
		];
	}),

	actions: {
		/**
		 * @returns {void}
		 */
		hide() {
			this.sendAction('toggleVisibility', false);
		},
	},
});
