import Ember from 'ember';

export default Ember.Mixin.create({
	canShowCategories: Ember.computed('categories', 'currentUser.permissions.discussions.canEditCategories', function () {
		const categories = this.get('categories'),
			canEditCategories = this.get('currentUser.permissions.discussions.canEditCategories');

		return categories && (categories.length > 1 || canEditCategories);
	})
});
