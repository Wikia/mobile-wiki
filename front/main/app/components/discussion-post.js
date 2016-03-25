import DiscussionModalDialogMixin from '../mixins/discussion-modal-dialog';

export default Ember.Component.extend(DiscussionModalDialogMixin,
	{
		discussionSort: Ember.inject.service(),

		canShowMore: Ember.computed('model.repliesCount', 'model.replies.length', function () {
			return this.get('model.replies.length') < this.get('model.repliesCount');
		}),

		canReply: Ember.computed('model.isDeleted', 'model.isLocked', function () {
			return !this.get('model.isDeleted') && !this.get('model.isLocked');
		}),
	}
);
