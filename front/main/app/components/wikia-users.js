import Ember from 'ember';
import Thumbnailer from 'common/modules/Thumbnailer';

export default Ember.Component.extend({
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
