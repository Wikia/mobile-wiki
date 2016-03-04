import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

export default Ember.Mixin.create({
	/**
	 * @desc Track click on element
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

	/**
	 * @desc Track focus on element
	 * @param {string} category
	 * @param {string} [label='']
	 * @param {boolean} [isNonInteractive=true]
	 * @returns {void}
	 */
	trackFocus(category, label = '', isNonInteractive = true) {
		track({
			action: trackActions.focus,
			category,
			label,
			isNonInteractive
		});
	},

	/**
	 * @desc Track keypress on element
	 * @param {string} category
	 * @param {string} [label='']
	 * @param {boolean} [isNonInteractive=true]
	 * @returns {void}
	 */
	trackKeypress(category, label = '', isNonInteractive = true) {
		track({
			action: trackActions.focus,
			category,
			label,
			isNonInteractive
		});
	},

	/**
	 * @desc Track change, that occured as a result
	 * of action or set of actions
	 *
	 * @param {string} category
	 * @param {string} [label='']
	 * @returns {void}
	 */
	trackChange(category, label = '') {
		track({
			action: trackActions.change,
			category,
			label,
			isNonInteractive: true
		});
	},

	/**
	 * @desc Track successful response
	 *
	 * @param {string} category
	 * @param {string} [label='']
	 * @returns {void}
	 */
	trackSuccess(category, label = '') {
		track({
			action: trackActions.success,
			category,
			label,
			isNonInteractive: true
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
		},

		/**
		 * @param {string} category
		 * @param {string} [label='']
		 * @param {boolean} [isNonInteractive=true]
		 * @returns {void}
		 */
		trackFocus(category, label = '', isNonInteractive = true) {
			this.trackFocus(category, label, isNonInteractive);
		},

		/**
		 * @param {string} category
		 * @param {string} [label='']
		 * @param {boolean} [isNonInteractive=true]
		 * @returns {void}
		 */
		trackKeypress(category, label = '', isNonInteractive = true) {
			this.trackFocus(category, label, isNonInteractive);
		},

		/**
		 * @param {string} category
		 * @param {string} [label='']
		 * @returns {void}
		 */
		trackChange(category, label = '') {
			this.trackChange(category, label);
		},

		/**
		 * @param {string} category
		 * @param {string} [label='']
		 * @returns {void}
		 */
		trackSuccess(category, label = '') {
			this.trackSuccess(category, label);
		}
	}
});
