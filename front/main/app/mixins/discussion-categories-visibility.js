import Ember from 'ember';

export default Ember.Mixin.create({
	canShowCategories: Ember.computed('categories', 'currentUser.permissions.discussions.canEditCategories', function () {
		const categoriesLength = this.getWithDefault('categories.length', 0),
			canEditCategories = this.get('currentUser.permissions.discussions.canEditCategories');

		return categoriesLength > 1 || canEditCategories;
	})
});
