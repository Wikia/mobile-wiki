import Ember from 'ember';

/**
 * Handles sending upvote action outside from the component.
 */
export default Ember.Mixin.create({
	classNames: ['large-4', 'upvote'],
	classNameBindings: ['hasUpvoted'],

	post: null,
	hasUpvoted: Ember.computed.readOnly('post.userData.hasUpvoted'),
});
