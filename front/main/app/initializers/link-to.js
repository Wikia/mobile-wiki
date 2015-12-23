import Ember from 'ember';

/**
 * @returns {void}
 */
export function initialize() {
	Ember.LinkComponent.reopen({
		attributeBindings: ['data-tracking-category'],

		// it allows to use action='x' actionParam='y' in link-to helper
		action: null,

		/**
		 * @param {Event} event
		 * @returns {boolean}
		 */
		_invoke(event) {
			const action = this.get('action');

			if (action) {
				// There was an action specified (in handlebars) so take custom action
				if (this.bubbles === false) {
					event.stopPropagation();
				}

				// trigger the action on the controller
				this.get('parentView').get('context').send(action, this.get('actionParam'));
			}

			return this._super(event);
		},
	});
}

export default {
	name: 'link-to',
	initialize
};
