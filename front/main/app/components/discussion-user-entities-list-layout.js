import DiscussionModalDialogMixin from '../mixins/discussion-modal-dialog';
import ResponsiveMixin from '../mixins/responsive';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend(
	DiscussionModalDialogMixin,
	ResponsiveMixin,
	{
		discussionSort: Ember.inject.service(),

		actions: {
			deleteAllPosts() {
				this.get('deleteAllPosts')();

				track(trackActions.DeleteAllTapped);
			}
		}
	}
);
