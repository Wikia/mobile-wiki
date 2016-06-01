import Ember from 'ember';

import DiscussionCategoriesModel from '../models/discussion/categories';

export default Ember.Route.extend({
	model() {
		return DiscussionCategoriesModel.getCategories(Mercury.wiki.id);
	}
});
