import App from '../app';
import Thumbnailer from '../../mercury/modules/Thumbnailer';

export default App.WikiaUsersComponent = Ember.Component.extend({
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
