import DiscussionCategoriesModel from '../models/discussion/categories';
import DiscussionSiteAttributesModel from '../models/discussion/site-attributes';
import Ember from 'ember';


export default Ember.Mixin.create({

	/**
	 *
	 * @param indexModel - model which holds all reusable properties
	 * @param requests
	 * @returns {*|{}}
	 */
	createRequestsBasedOn(indexModel, requests) {
		let hash = requests || {};

		if (!indexModel.get('categories')) {
			hash.categories = DiscussionCategoriesModel.getCategories(Mercury.wiki.id);
		}

		if (!indexModel.get('attributes')) {
			hash.attributes = DiscussionSiteAttributesModel.find(Mercury.wiki.id);
		}

		return hash;
	},

	updateModelWith(indexModel, model) {
		if (!indexModel.get('categories')) {
			indexModel.set('categories', model.categories);
			model.categories = undefined;
		}

		if (!indexModel.get('attributes')) {
			indexModel.set('attributes', model.attributes);
			model.attributes = undefined;
		}
	}
});
