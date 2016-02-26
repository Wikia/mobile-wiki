import Ember from 'ember';

export default Ember.Mixin.create({
	contributors: [],
	isRequesterBlocked: false,

	name: null,
	pageNum: null,
	posts: null,
	totalPosts: 0,

	/**
	 * @param {error} err
	 *
	 * @returns {void}
	 */
	onCreatePostError(err) {
		if (err.status === 401) {
			this.setFailedState('editor.post-error-not-authorized');
		} else {
			this.setFailedState('editor.post-error-general-error');
		}
	},

	/**
	 * @param {object} forumInstance
	 * @param {error} err
	 *
	 * @returns {void}
	 */
	onFindError(forumInstance, err) {
		forumInstance.setErrorProperty(err);
	},

	/**
	 * @param {string} sortBy
	 *
	 * @returns {string}
	 */
	getSortKey(sortBy) {
		switch (sortBy) {
		case 'latest':
			return 'creation_date';
		case 'trending':
			return 'trending';
		default:
			return '';
		}
	},
});
