import Ember from 'ember';
import {track, trackActions} from '../../mercury/utils/track';

export default Ember.Mixin.create({
	/**
	 * @param {string} category
	 * @param {string} [label='']
	 * @param {boolean} [isNonInteractive=true]
	 * @returns {void}
	 */
	trackClick(category, label = '', isNonInteractive = true) {
		track({
			action: trackActions.click,
			category,
			label,
			isNonInteractive
		});
	},

	actions: {
		/**
		 * @param {string} category
		 * @param {string} [label='']
		 * @param {boolean} [isNonInteractive=true]
		 * @returns {void}
		 */
		trackClick(category, label = '', isNonInteractive = true) {
			this.trackClick(category, label, isNonInteractive);
		}
	}
});
