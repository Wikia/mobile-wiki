import Ember from 'ember';

export default Ember.Mixin.create(
	{
		actions: {
			/**
			 * Bubbles up to DiscussionForumRoute
			 *
			 * @returns {void}
			 */
			retry() {
				this.get('target').send('retry');
			},

			/**
			 * Bubbles up to DiscussionForumRoute
			 *
			 * @param {object} postData
			 *
			 * @returns {void}
			 */
			create(postData) {
				this.get('target').send('create', postData);
			},

			/**
			 * Bubbles up to DiscussionForumRoute
			 *
			 * @param {number} pageNum
			 *
			 * @returns {void}
			 */
			loadPage(pageNum) {
				this.get('target').send('loadPage', pageNum);
			},

			/**
			 * Bubbles up to DiscussionForumRoute
			 *
			 * @param {string} sortBy
			 *
			 * @returns {void}
			 */
			setSortBy(sortBy) {
				this.get('target').send('setSortBy', sortBy);
			},

			/**
			 * @param {string} sortBy
			 * @param {boolean} shouldShowReported
			 *
			 * @returns {void}
			 */
			applyFilters(sortBy, shouldShowReported) {
				this.get('target').send('applyFilters', sortBy, shouldShowReported);
			}
		}
	}
);
