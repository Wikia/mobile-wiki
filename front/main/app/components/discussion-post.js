import DiscussionModalDialogMixin from '../mixins/discussion-modal-dialog';
import DiscussionPermalinkMixin from '../mixins/discussion-permalink';

export default Ember.Component.extend(
	DiscussionModalDialogMixin,
	DiscussionPermalinkMixin,
	{
		discussionSort: Ember.inject.service(),

		// we can't use: Ember.computed.gt('model.replies.0.position', 1),
		// because we don't change the 'position' property of first reply - we add new objects there
		canShowOlder: Ember.computed('model.replies.@each.position', function () {
			return this.get('model.replies.0.position') > 1;
		}),

		canReply: Ember.computed('model.isDeleted', 'model.isLocked', function () {
			return !this.get('model.isDeleted') && !this.get('model.isLocked');
		}),

		didInsertElement() {
			this.showLiknedElement();
		},
	}
);
