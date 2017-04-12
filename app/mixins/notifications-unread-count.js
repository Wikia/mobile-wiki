import Ember from 'ember';

const {Mixin, computed} = Ember;

export default Mixin.create({
	unreadCount: computed('notifications.model.unreadCount', function() {
		const count = 100;// this.get('notifications.model.unreadCount');
		if (count > 99) {
			return '99+';
		} else {
			return count;
		}
	}),
	hasUnread: computed.gt('notifications.model.unreadCount', 0),
});
