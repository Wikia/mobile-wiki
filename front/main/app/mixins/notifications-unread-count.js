import Ember from 'ember';

const {Mixin, computed} = Ember;

export default Mixin.create({
	unreadCount: computed.oneWay('notifications.model.unreadCount'),
	hasUnread: computed.gt('notifications.model.unreadCount', 0),
});
