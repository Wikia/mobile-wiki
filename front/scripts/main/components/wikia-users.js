import Ember from 'ember';

const WikiaUsersComponent = Ember.Component.extend({
	avatarHeight: 100,
	avatarWidth: 100,
	classNameBindings: ['classes'],
	isVisible: Ember.computed.notEmpty('users'),
	label: null,
	limit: 5,
	thumbMode: Mercury.Modules.Thumbnailer.mode.fixedAspectRatio,
	trackingEvent: null,
	users: [],
});

export default WikiaUsersComponent;
