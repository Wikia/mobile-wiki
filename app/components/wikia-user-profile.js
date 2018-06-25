import { inject as service } from '@ember/service';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import NoScrollMixin from '../mixins/no-scroll';
import NotificationsScrollMenuMixin from '../mixins/notifications-scroll-menu';
import MarkAllNotificationsMixin from '../mixins/mark-all-notifications';
import { trackOpenMenu } from '../utils/notifications-tracker';

export default Component.extend(
	NoScrollMixin,
	NotificationsScrollMenuMixin,
	MarkAllNotificationsMixin,
	{
		currentUser: service(),
		notifications: service(),
		wikiVariables: service(),

		classNames: ['wikia-user-profile'],

		setDrawerContent() {},

		notificationsList: oneWay('notifications.model.data'),
		isLoadingNewResults: oneWay('notifications.isLoading'),
		username: oneWay('currentUser.name'),

		init() {
			this._super(...arguments);
			this.errors = [];
			this.notifications.loadFirstPage();
		},

		didRender() {
			this._super(...arguments);
			this.element.scrollTop = 0;
			trackOpenMenu(this.notifications.getUnreadCount());
		},

		actions: {
			getBack() {
				this.setDrawerContent('nav');
			},
		}
	}
);
