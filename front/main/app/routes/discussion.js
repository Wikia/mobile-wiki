import Ember from 'ember';

import DiscussionModel from '../models/discussion';
import DiscussionAttributesModel from '../models/discussion/attributes';

export default Ember.Route.extend({
	model() {
		return Ember.RSVP.hash({
			categories: DiscussionModel.getCategories(Mercury.wiki.id),
			attributes: DiscussionAttributesModel.getAttributes(Mercury.wiki.id),
		});
	}
});
