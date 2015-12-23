import Ember from 'ember';

/**
 * Handles sending upvote action outside from the component.
 */
export default Ember.Mixin.create({
	classNames: ['small-5', 'large-3', 'columns', 'upvote', 'count'],
	classNameBindings: ['hasUpvoted'],

	post: null,
	hasUpvoted: Ember.computed('post._embedded.userData.@each.hasUpvoted', function () {
		if (Ember.isArray(this.get('post._embedded.userData'))) {
			return this.get('post._embedded.userData')[0].hasUpvoted;
		}

		return false;
	})
});
