import DiscussionModalDialogMixin from '../mixins/discussion-modal-dialog';

export default Ember.Component.extend(DiscussionModalDialogMixin,
	{
		discussionSort: Ember.inject.service(),

		canShowMore: Ember.computed.lt('model.replies.length', 'model.repliesCount'),

		canReply: Ember.computed('model.isDeleted', 'model.isLocked', function () {
			return !this.get('model.isDeleted') && !this.get('model.isLocked');
		}),
	}
);
