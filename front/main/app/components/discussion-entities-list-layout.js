import DiscussionModalDialogMixin from '../mixins/discussion-modal-dialog';
import DiscussionCategoriesVisibilityMixin from '../mixins/discussion-categories-visibility';

export default Ember.Component.extend(
	DiscussionModalDialogMixin,
	DiscussionCategoriesVisibilityMixin,
	{
		currentUser: Ember.inject.service(),
		discussionSort: Ember.inject.service(),

		hasNewPostButton: true,
	}
);
