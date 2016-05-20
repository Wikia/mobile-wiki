import Ember from 'ember';
import DiscussionUpvoteActionSendMixin from '../mixins/discussion-upvote-action-send';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend(
	DiscussionUpvoteActionSendMixin,
	{
		classNameBindings: ['isDetailsView:sideSpaced'],
		discussionEditor: Ember.inject.service(),

		actions: {
			reply() {
				if (this.get('isDetailsView')) {
					this.get('discussionEditor').toggleEditor(true);
				}

				track(trackActions.ReplyButtonTapped);
			}
		},
	}
);
