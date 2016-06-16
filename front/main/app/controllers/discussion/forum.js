import DiscussionModerationControllerMixin from '../../mixins/discussion-moderation-controller';
import DiscussionContributionControllerMixin from '../../mixins/discussion-contribution-controller';
import DiscussionForumActionsControllerMixin from '../../mixins/discussion-forum-actions-controller';
import ResponsiveMixin from '../../mixins/responsive';
import DiscussionBaseController from './base';


export default DiscussionBaseController.extend(
	DiscussionModerationControllerMixin,
	DiscussionContributionControllerMixin,
	DiscussionForumActionsControllerMixin,
	ResponsiveMixin, {
		actions: {
			createPost(entityData) {
				this.transitionToRoute({queryParams: {sort: 'latest'}}).promise.then(() => {
					// this._super(entityData);
					const editorType = 'contributeEditor',
						editorState = this.getEditorState(editorType);

					editorState.set('isLoading', true);
					this.setEditorError(editorType, null);

					this.get('model').createPost(entityData).catch((err) => {
						this.onContributionError(editorType, err, 'editor.post-error-general-error');
					}).finally(() => {
						editorState.set('isLoading', false);
					});
				});
			}
		}
	}
);
