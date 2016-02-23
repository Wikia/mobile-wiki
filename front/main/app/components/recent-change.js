import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['recent-change'],
	classNameBindings: ['active'],
	currentUser: Ember.inject.service(),
	active: Ember.computed('id', 'rc', function () {
		return this.get('id') === this.get('rc');
	}),
	userUpvoted: Ember.computed('model.upvotes', 'currentUser.userId', function () {
		const upvotes = this.get('model.upvotes');

		if (upvotes) {
			return upvotes.isAny('from_user', this.get('currentUser.userId').toString());
		}
		return false;
	}),
	hasDiff: Ember.computed.and('model.old_revid', 'model.revid'),
	showDiffLink: true
});
