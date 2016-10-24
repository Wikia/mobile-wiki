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

	setStartPageNumber(page) {
		if (page === 1) {
			this.set('firstPageLoaded', true);
		} else {
			// API numerates pages from 0, UI from 1
			this.set('data.pageNum', page - 1);
		}
	}
});
