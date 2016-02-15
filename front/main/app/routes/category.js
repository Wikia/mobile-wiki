import Ember from 'ember';
import CategoryModel from '../models/category';

export default Ember.Route.extend({
	ajax: Ember.inject.service(),

	model(params) {
		return CategoryModel.create({
			name: params.name,
			ajax: this.get('ajax')
		}).load();
	}
});
