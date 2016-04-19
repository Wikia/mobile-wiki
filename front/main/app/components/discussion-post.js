import DiscussionEditEditorMixin from '../mixins/discussion-edit-editor';

export default Ember.Component.extend(DiscussionEditEditorMixin,
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
