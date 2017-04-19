import Ember from 'ember';
import NoScrollMixin from '../mixins/no-scroll';
import NotificationsScrollMenuMixin from '../mixins/notifications-scroll-menu';
import MarkAllNotificationsMixin from '../mixins/mark-all-notifications';
import {trackOpenMenu} from '../utils/notifications-tracker';

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
		username: computed.oneWay('currentUser.name'),

		init() {
			this._super(...arguments);
			this.errors = [];
			this.get('notifications').loadFirstPage();
		},

		didRender() {
			this._super(...arguments);
			this.element.scrollTop = 0;
			trackOpenMenu(this.get('notifications').getUnreadCount());
		},

		actions: {
			getBack() {
				this.sendAction('setDrawerContent', 'nav');
			},
		}
	}
);
