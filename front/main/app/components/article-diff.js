import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['diff-page'],
	currentUser: Ember.inject.service(),
	currentUserUpvoteId: Ember.computed(function () {
		const upvotes = this.get('model.upvotes');

		for (const upvote of upvotes) {
			if (parseInt(upvote.from_user, 10) === this.get('currentUser.userId')) {
				return parseInt(upvote.id, 10);
			}
		}
		return null;
	}),
	userNotBlocked: Ember.computed.not('currentUser.isBlocked'),
	showButtons: Ember.computed.and('currentUser.isAuthenticated', 'userNotBlocked'),
	showDiffLink: false,
	upvoted: Ember.computed('model.upvotes', 'currentUser.userId', function () {
		const upvotes = this.get('model.upvotes');

		return upvotes && upvotes.some((upvote) => {
			return parseInt(upvote.from_user, 10) === this.get('currentUser.userId');
		});
	}),
	classUpvote: Ember.computed('upvoted', function () {
		return this.get('upvoted') ? 'diff-page__upvote--upvoted' : 'diff-page__upvote';
	}),

	actions: {
		downvote() {
			this.downvote(this.get('currentUserUpvoteId'));
		}
	}
});
