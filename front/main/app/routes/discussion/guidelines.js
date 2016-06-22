import Ember from 'ember';
import DiscussionAttributesModel from '../../models/discussion/attributes';
import DiscussionModerationRouteMixin from '../../mixins/discussion-moderation-route';

export default Ember.Route.extend({
	model(params) {
		const indexModel = this.modelFor('discussion');

		return Ember.RSVP.hash({
			attributes: indexModel.attributes,
		});
	},
});
