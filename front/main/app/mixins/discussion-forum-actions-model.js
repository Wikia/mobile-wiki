import Ember from 'ember';

export default Ember.Mixin.create({
	contributors: [],
	isRequesterBlocked: false,

	name: null,
	pageNum: null,
	posts: null,
	totalPosts: 0,
	firstPageLoaded: false,

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
