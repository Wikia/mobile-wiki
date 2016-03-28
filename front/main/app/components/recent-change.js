import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['recent-change'],
	classNameBindings: ['active'],
	currentUser: Ember.inject.service(),
	revisionUpvotes: Ember.inject.service(),
	active: Ember.computed('id', 'rc', function () {
		return this.get('id') === this.get('rc');
	}),
	upvotesCount: Ember.computed('revisionUpvotes.upvotes.@each.count', function() {
		return this.get('revisionUpvotes.upvotes').findBy('revisionId', this.get('model.newId')).upvotes.length;
	}),
	upvotesEnabled: Ember.get(Mercury, 'wiki.language.content') === 'en',
	userUpvoted: Ember.computed('revisionUpvotes.upvotes.@each.count', 'currentUser.userId', function () {
		const upvotes = this.get('model.upvotes'),
			userId = this.get('currentUser.userId');

		return upvotes && userId && upvotes.isAny('from_user', userId);
	}),
	hasDiff: Ember.computed.and('model.old_revid', 'model.revid'),
	showDiffLink: true,

	didReceiveAttrs() {
		this.get('revisionUpvotes').addVote(this.get('model.newId'), this.get('model.upvotes'));
	},

	actions: {
		handleVote(revisionId, title) {
			if (this.get('userUpvoted')) {
				// TODO this.removeUpvote(this.get('currentUserUpvoteId'));
			} else {
				this.get('upvote')(revisionId, title, this.get('currentUser.userId')).then(
					() => {},
					() => {
						this.get('application').addAlert({
							message: i18n.t('main.error', {ns: 'recent-wiki-activity'}),
							type: 'alert'
						});
					}
				);
			}
		}
	}
});
