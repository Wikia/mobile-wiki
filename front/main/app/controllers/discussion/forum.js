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

		categoriesObserver: Ember.observer('model.index.selectedCategoryIds', function () {
			if (this.get('catId.length') !== this.get('model.index.selectedCategoryIds.length')) {
				this.get('target').send('changeCategory', this.get('model.index.selectedCategoryIds'));
			}
		}),
	}
);
