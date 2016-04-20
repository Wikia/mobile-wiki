import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

/**
 * @returns {void}
 */
export function initialize() {
	Ember.LinkComponent.reopen({
		// it allows to use action='x' actionParam='y' in link-to helper
		action: null,

		/**
		 * @param {Event} event
		 * @returns {boolean}
		 */
		_invoke(event) {
			const action = this.get('action'),
				trackingCategory = this.get('trackingCategory'),
				trackingLabel = this.get('trackingLabel');

			if (action) {
				// There was an action specified (in handlebars) so take custom action
				if (this.bubbles === false) {
					event.stopPropagation();
				}

				// trigger the action on the controller
				this.get('parentView').get('context').send(action, this.get('actionParam'));
			}

			if (trackingCategory) {
				track({
					action: trackActions.click,
					category: trackingCategory,
					label: trackingLabel
				});
			}

			return this._super(event);
		},
	});
}

export default {
	name: 'link-to',
	initialize
};
