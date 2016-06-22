import Ember from 'ember';

import DiscussionModel from '../models/discussion';
import DiscussionAttributesModel from '../models/discussion/attributes';

export default Ember.Route.extend({
	model() {
		return Ember.RSVP.hash({
			categories: DiscussionModel.getCategories(Mercury.wiki.id),
			attributes: DiscussionAttributesModel.getAttributes(Mercury.wiki.id),
		});
	},

	actions: {
		/**
		 * Attempt to edit guidelines
		 * @param {String} name - attribute name
		 * @param {String} value - the new value for the attribute
		 * @returns {void}
		 */
		editAttribute(name, value) {
			const attributesModel = this.modelFor(this.get('routeName')).index.attributes;

			// reset previous editor errors

			attributesModel.editAttribute(value).then(() => {
				//action after successful edit
			}).catch((err) => {
				this.onContributionError(err, 'editor.save-error-general-error', true);
			}).finally(() => {
				// turn off the editor isLoading state
			});
		},
	}
});
