import {notEmpty} from '@ember/object/computed';
import Component from '@ember/component';
import {track, trackActions} from '../utils/track';
import InViewportMixin from 'ember-in-viewport';

export default Component.extend(InViewportMixin, {
	classNames: ['contributors'],
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
	}
});
