import Ember from 'ember';

/**
 * Handles sending upvote action outside from the component.
 */
export default Ember.Mixin.create({
	classNames: ['small-5', 'large-4', 'columns', 'upvote', 'action'],
	classNameBindings: ['hasUpvoted'],

	post: null,
	hasUpvoted: Ember.computed.readOnly('post.userData.hasUpvoted'),
});
