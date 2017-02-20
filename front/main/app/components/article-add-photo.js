import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

export default Ember.Component.extend({
	actions: {
		/**
		 * @returns {void}
		 */
		back() {
			this.sendAction('back');
			this.track('back');
		},

		/**
		 * @returns {void}
		 */
		upload() {
			this.sendAction('upload');
			this.track('upload');
		},
	},

	/**
	 * @param {string} label
	 * @returns {void}
	 */
	track(label) {
		track({
			action: trackActions.click,
			category: 'sectionaddphoto',
			label
		});
	},
});
