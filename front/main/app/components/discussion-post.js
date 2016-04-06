export default Ember.Component.extend(
	{
		discussionSort: Ember.inject.service(),

		canShowMore: Ember.computed('model.replies.length', 'model.repliesCount', function () {
			return this.get('model.replies.length') < this.get('model.repliesCount');
		}),

		canReply: Ember.computed('model.isDeleted', 'model.isLocked', function () {
			return !this.get('model.isDeleted') && !this.get('model.isLocked');
		}),
	}
);
