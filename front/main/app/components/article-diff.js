import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['diff-page'],
	currentUser: Ember.inject.service(),
	currentUserUpvoteId: Ember.computed('model.upvotes', 'currentUser.userId', function () {
		const upvotes = this.get('model.upvotes'),
			currentUserUpvote = upvotes ? upvotes.filterBy(
				'from_user',
				String(this.get('currentUser.userId'))
			)[0] : null;

		return currentUserUpvote ? currentUserUpvote.id : null;
	}),
	userNotBlocked: Ember.computed.not('currentUser.isBlocked'),
	showButtons: Ember.computed.and('currentUser.isAuthenticated', 'userNotBlocked'),
	showDiffLink: false,
	upvoted: Ember.computed.bool('currentUserUpvoteId'),
	buttonVoteClass: Ember.computed('upvoted', function () {
		return this.get('upvoted') ? 'diff-page__vote--upvoted' : 'diff-page__vote';
	}),

	actions: {
		handleVote() {
			if (this.get('upvoted')) {
				this.downvote(this.get('currentUserUpvoteId'));
			} else {
				this.upvote();
			}
		}
	}
});
