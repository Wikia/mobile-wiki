import Ember from 'ember';
import DiscussionUpvoteActionSendMixin from '../mixins/discussion-upvote-action-send';

export default Ember.Component.extend(
	DiscussionUpvoteActionSendMixin,
	{
		classNameBindings: ['isDetailsView:sideSpaced'],
		discussionEditor: Ember.inject.service(),

		actions: {
			openEditor() {
				if (this.get('isDetailsView')) {
					this.get('discussionEditor').toggleEditor(true);
				}
			}
		},
	}
);
