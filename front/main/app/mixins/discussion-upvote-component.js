import Ember from 'ember';

/**
 * Handles sending upvote action outside from the component.
 */
export default Ember.Mixin.create({
	classNames: ['small-5', 'large-3', 'columns', 'upvote', 'count'],
	classNameBindings: ['hasUpvoted'],

	post: null,
	hasUpvoted: Ember.computed.alias('post.userData.hasUpvoted'),
});
