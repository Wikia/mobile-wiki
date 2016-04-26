import DiscussionModalDialogMixin from '../mixins/discussion-modal-dialog';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend(DiscussionModalDialogMixin, {
	discussionSort: Ember.inject.service(),

	actions: {
		deleteAllPosts() {
			this.attrs.deleteAllPosts();

			track(trackActions.DeleteAllTapped);
		}
	}
});
