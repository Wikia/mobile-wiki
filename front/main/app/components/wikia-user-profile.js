import Ember from 'ember';
import NoScrollMixin from '../mixins/no-scroll';
import {track, trackActions} from 'common/utils/track';
import NotificationsScrollMenuMixin from '../mixins/notifications-scroll-menu';
import MarkAllNotificationsMixin from '../mixins/mark-all-notifications';

const {Component, computed, inject} = Ember;

export default Component.extend(
	NoScrollMixin,
	NotificationsScrollMenuMixin,
	MarkAllNotificationsMixin,
	{
		classNames: ['wikia-user-profile'],
		currentUser: inject.service(),
		notifications: inject.service(),

		notificationsList: computed.oneWay('notifications.model.data'),
		isLoadingNewResults: computed.oneWay('notifications.isLoading'),

		logoutLink: M.buildUrl({
			namespace: 'Special',
			title: 'UserLogout'
		}),

		userProfileLink: computed('currentUser.name', function () {
			return M.buildUrl({
				namespace: 'User',
				title: this.get('currentUser.name')
			});
		}),

		username: computed.oneWay('currentUser.name'),

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
