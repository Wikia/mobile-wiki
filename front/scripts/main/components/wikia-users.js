
import Thumbnailer from '../../mercury/modules/Thumbnailer';

const WikiaUsersComponent = Ember.Component.extend({
	avatarHeight: 100,
	avatarWidth: 100,
	classNameBindings: ['classes'],
	isVisible: Ember.computed.notEmpty('users'),
	label: null,
	limit: 5,
	thumbMode: Thumbnailer.mode.fixedAspectRatio,
	trackingEvent: null,
	users: [],
});

export default WikiaUsersComponent;
