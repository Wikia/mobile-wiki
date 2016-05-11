import DiscussionEditorService from './discussion-editor';

export default DiscussionEditorService.extend({
	discussionEntity: null,

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
