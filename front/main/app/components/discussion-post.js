import DiscussionModalDialogMixin from '../mixins/discussion-modal-dialog';
import DiscussionPermalinkMixin from '../mixins/discussion-permalink';

export default Ember.Component.extend(
	DiscussionModalDialogMixin,
	DiscussionPermalinkMixin,
	{
		discussionSort: Ember.inject.service(),

		canShowOlder: Ember.computed('model.replies.firstObject.position', function () {
			return this.get('model.replies.firstObject.position') > 1;
		}),

		canShowNewer: Ember.computed('model.replies.lastObject.position', 'model.repliesCount', function () {
			return this.get('model.replies.lastObject.position') < this.get('model.repliesCount');
		}),

		canReply: Ember.computed('model.isDeleted', 'model.isLocked', function () {
			return !this.get('model.isDeleted') && !this.get('model.isLocked');
		}),
	}
);
