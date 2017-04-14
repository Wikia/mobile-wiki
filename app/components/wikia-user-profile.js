import Ember from 'ember';
import NoScrollMixin from '../mixins/no-scroll';
import NotificationsScrollMenuMixin from '../mixins/notifications-scroll-menu';
import MarkAllNotificationsMixin from '../mixins/mark-all-notifications';
import {buildUrl} from '../utils/url';

const {Component, computed, inject} = Ember;

export default Component.extend(
	NoScrollMixin,
	NotificationsScrollMenuMixin,
	MarkAllNotificationsMixin,
	{
		classNames: ['wikia-user-profile'],
		currentUser: inject.service(),
		notifications: inject.service(),
		wikiVariables: inject.service(),

		notificationsList: computed.oneWay('notifications.model.data'),
		isLoadingNewResults: computed.oneWay('notifications.isLoading'),

		logoutLink: computed(function () {
			return buildUrl({
				host: this.get('wikiVariables.host'),
				namespace: 'Special',
				title: 'UserLogout'
			});
		}),

		username: computed.oneWay('currentUser.name'),

		init() {
			this._super(...arguments);
			this.errors = [];
			this.get('notifications').loadNextPage();
		},

		didRender() {
			this._super(...arguments);
			this.element.scrollTop = 0;
		},

		actions: {
			getBack() {
				this.sendAction('setDrawerContent', 'nav');
			},
		}
	}
);
