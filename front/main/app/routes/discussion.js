import Ember from 'ember';

import DiscussionCategoriesModel from '../models/discussion/categories';
import DiscussionSiteAttributesModel from '../models/discussion/site-attributes';

export default Ember.Route.extend({
	model() {
		return Ember.RSVP.hash({
			categories: DiscussionCategoriesModel.getCategories(Mercury.wiki.id),
			attributes: DiscussionSiteAttributesModel.find(Mercury.wiki.id),
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

			this.setEditorError(null, true);

			attributesModel.editAttribute(value).catch((err) => {
				this.onContributionError(err, 'editor.save-error-general-error', true);
			}).finally(() => {
				this.get('discussionEditEditor').set('isLoading', false);
			});
		},
	}
});
