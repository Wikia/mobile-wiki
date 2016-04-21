import Ember from 'ember';
import DiscussionModerationControllerMixin from '../../mixins/discussion-moderation-controller';
import DiscussionContributionControllerMixin from '../../mixins/discussion-contribution-controller';
import DiscussionEditEditorMixin from '../../mixins/discussion-edit-editor';

export default Ember.Controller.extend(
	DiscussionModerationControllerMixin,
	DiscussionContributionControllerMixin,
	DiscussionEditEditorMixin,
	{
		postListSort: '',

		actions: {
			/**
			 * Bubbles up to DiscussionPostRoute
			 *
			 * @returns {void}
			 */
			retry() {
				this.get('target').send('retry');
			},

			/**
			 * Bubbles up to DiscussionPostRoute
			 *
			 * @returns {void}
			 */
			loadOlderReplies() {
				this.get('target').send('loadOlderReplies');
			},

			/**
			 * Bubbles up to DiscussionPostRoute
			 *
			 * @returns {void}
			 */
			loadNewerReplies() {
				this.get('target').send('loadNewerReplies');
			},
		}
	}
);
