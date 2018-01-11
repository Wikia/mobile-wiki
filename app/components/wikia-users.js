import {notEmpty} from '@ember/object/computed';
import Component from '@ember/component';
import Thumbnailer from '../modules/thumbnailer';
import {track, trackActions} from '../utils/track';

export default Component.extend(
	{
		avatarHeight: 100,
		avatarWidth: 100,
		classNameBindings: ['classes'],
		label: null,
		limit: 5,
		trackingEvent: null,
		users: null,

		isVisible: notEmpty('users'),

		actions: {
			trackClick(category, label) {
				track({
					action: trackActions.click,
					category,
					label
				});
			}
		},

		thumbMode: Thumbnailer.mode.fixedAspectRatio
	}
);
