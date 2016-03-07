import Ember from 'ember';
import Thumbnailer from 'common/modules/Thumbnailer';
import TrackClickMixin from '../mixins/track-click';

export default Ember.Component.extend(
	TrackClickMixin,
	{
		avatarHeight: 100,
		avatarWidth: 100,
		classNameBindings: ['classes'],
		isVisible: Ember.computed.notEmpty('users'),
		label: null,
		limit: 5,
		thumbMode: Thumbnailer.mode.fixedAspectRatio,
		trackingEvent: null,
		users: [],
	}
);
