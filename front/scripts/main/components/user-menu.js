import Ember from 'ember';
import {buildUrl} from '../../baseline/mercury/utils/buildUrl';

const UserMenuComponent = Ember.Component.extend({
	classNames: ['user-menu'],
	classNameBindings: ['shouldBeVisible:visible:collapsed'],

	isVisible: Ember.computed.bool('currentUser.isAuthenticated'),

	links: Ember.computed('currentUser.name', function () {
		return [
			{
				href: buildUrl({
					namespace: 'User',
					title: this.get('currentUser.name'),
				}),
				textKey: 'user-menu-profile',
			},
			{
				href: buildUrl({
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

export default UserMenuComponent;
