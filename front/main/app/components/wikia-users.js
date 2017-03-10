import Ember from 'ember';
import Thumbnailer from '../modules/thumbnailer';
import {track, trackActions} from '../utils/track';

export default Ember.Component.extend(
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

		actions: {
			trackClick(category, label) {
				track({
					action: trackActions.click,
					category,
					label
				});
			}
		}
	}
);
