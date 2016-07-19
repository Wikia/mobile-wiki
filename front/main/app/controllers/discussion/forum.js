import DiscussionModerationControllerMixin from '../../mixins/discussion-moderation-controller';
import DiscussionContributionControllerMixin from '../../mixins/discussion-contribution-controller';
import DiscussionForumActionsControllerMixin from '../../mixins/discussion-forum-actions-controller';
import DiscussionEditEditorMixin from '../../mixins/discussion-edit-editor';
import DiscussionBaseController from './base';


export default DiscussionBaseController.extend(
	DiscussionModerationControllerMixin,
	DiscussionContributionControllerMixin,
	DiscussionForumActionsControllerMixin,
	DiscussionEditEditorMixin,
	{
		catId: [],

		actions: {
			updateCategories(categories) {
				this.get('target').send('updateCategories', categories);
			},

			gotoGuidelines() {
				this.get('target').send('gotoGuidelines');
			}
		},
	},
);
