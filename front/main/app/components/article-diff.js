import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['diff-page'],
	currentUser: Ember.inject.service(),
	currentUserUpvoteId: Ember.computed('model.upvotes', 'currentUser.userId', function () {
		const upvotes = this.get('model.upvotes'),
			currentUserUpvote = upvotes ? upvotes.findBy(
				'from_user',
				String(this.get('currentUser.userId'))
			) : null;

		return currentUserUpvote ? currentUserUpvote.id : null;
	}),
	userNotBlocked: Ember.computed.not('currentUser.isBlocked'),
	showButtons: Ember.computed.and('currentUser.isAuthenticated', 'userNotBlocked'),
	showDiffLink: false,
	upvoted: Ember.computed.bool('currentUserUpvoteId')
});
