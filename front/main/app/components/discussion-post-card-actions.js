import Ember from 'ember';
import DiscussionUpvoteActionSendMixin from '../mixins/discussion-upvote-action-send';
import localStorageConnector from '../utils/local-storage-connector';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend(
	DiscussionUpvoteActionSendMixin,
	{
		classNameBindings: ['isDetailsView:sideSpaced'],
		followingLocalStorageSeenId: 'discussionFollowingTooltipSeen',
		followingTooltipSeen: false,

		actions: {
			reply() {
				if (this.get('isDetailsView')) {
					this.sendAction('setEditorActive', 'contributeEditor', true);
				}

				track(trackActions.ReplyButtonTapped);
			},

			follow(post) {
				this.get('follow')(post);
				this.set('followingTooltipSeen', true);
				localStorageConnector.setItem(this.get('followingLocalStorageSeenId'), true);
			}
		},
	}
);
