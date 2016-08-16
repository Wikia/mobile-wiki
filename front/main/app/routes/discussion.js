import Ember from 'ember';

import DiscussionModel from '../models/discussion';
import DiscussionSiteAttributesModel from '../models/discussion/site-attributes';
import RouteWithBodyClassNameMixin from '../mixins/route-with-body-class-name';

export default Ember.Route.extend(
	RouteWithBodyClassNameMixin,
	{
		bodyClassNames: ['show-global-footer'],

		model() {
			return Ember.RSVP.hash({
				categories: DiscussionModel.getCategories(Mercury.wiki.id),
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
			}
		},
	}
);
