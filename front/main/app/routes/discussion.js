import Ember from 'ember';

import DiscussionModel from '../models/discussion';

export default Ember.Route.extend({
	model() {
		return DiscussionModel.getCategories(Mercury.wiki.id);
	}
});
