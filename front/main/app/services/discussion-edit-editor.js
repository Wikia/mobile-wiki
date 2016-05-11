import DiscussionEditorService from './discussion-editor';

export default DiscussionEditorService.extend({
	discussionEntity: null,

	setDiscussionEntity(discussionEntity) {
		this.set('discussionEntity', discussionEntity);
	},

	/**
	 * @param {boolean} active
	 * @returns {void}
	 */
	toggleEditor(active) {
		this._super(active);

		if (!active) {
			this.set('discussionEntity', null);
		}
	}
});
