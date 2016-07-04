import DiscussionEditorService from './discussion-editor';

export default DiscussionEditorService.extend({
	discussionEntity: null,
	guidelines: null,

	/**
	 * @param {boolean} active
	 * @returns {void}
	 */
	toggleEditor(active) {
		this._super(active);

		if (!active) {
			this.setProperties({
				discussionEntity: null,
				guidelines: null
			});
		}
	}
});
