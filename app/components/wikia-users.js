import {notEmpty} from '@ember/object/computed';
import Component from '@ember/component';
import {track, trackActions} from '../utils/track';
import InViewportMixin from 'ember-in-viewport';

export default Component.extend(InViewportMixin, {
	classNames: ['contributors'],
	users: null,

	isVisible: notEmpty('users'),

	/**
	 * Reset InViewPort when new users recieved
	 */
	didUpdateAttrs() {
		if (this.get('viewportEntered')) {
			this.set('viewportEntered', false);
			this._startListening();
		}
	},

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
