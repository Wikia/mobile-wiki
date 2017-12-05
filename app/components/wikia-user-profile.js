import {inject as service} from '@ember/service';
import {oneWay} from '@ember/object/computed';
import Component from '@ember/component';
import NoScrollMixin from '../mixins/no-scroll';
import NotificationsScrollMenuMixin from '../mixins/notifications-scroll-menu';
import MarkAllNotificationsMixin from '../mixins/mark-all-notifications';
import {trackOpenMenu} from '../utils/notifications-tracker';

export default Component.extend(
	NoScrollMixin,
	NotificationsScrollMenuMixin,
	MarkAllNotificationsMixin,
	{
		classNames: ['wikia-user-profile'],
		currentUser: service(),
		notifications: service(),
		wikiVariables: service(),

		notificationsList: oneWay('notifications.model.data'),
		isLoadingNewResults: oneWay('notifications.isLoading'),
		username: oneWay('currentUser.name'),

		setDrawerContent() {},

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
				this.get('setDrawerContent')('nav');
			},
		}
	}
);
