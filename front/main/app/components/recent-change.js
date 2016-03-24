import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['recent-change'],
	classNameBindings: ['active'],
	currentUser: Ember.inject.service(),
	active: Ember.computed('id', 'rc', function () {
		return this.get('id') === this.get('rc');
	}),
	upvotesEnabled: Ember.get(Mercury, 'wiki.language.content') === 'en',
	userUpvoted: Ember.computed('model.upvotes.[]', 'currentUser.userId', function () {
		const upvotes = this.get('model.upvotes'),
			userId = this.get('currentUser.userId');

		return upvotes && userId && upvotes.isAny('from_user', userId);
	}),
	hasDiff: Ember.computed.and('model.old_revid', 'model.revid'),
	showDiffLink: true,

	actions: {
		handleVote() {
			// Process only if handler provided on invocation
			if (this.attrs.handleVote) {
				this.attrs.handleVote();
			}
		}
	}
});
