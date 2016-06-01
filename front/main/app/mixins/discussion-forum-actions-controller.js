import Ember from 'ember';

export default Ember.Mixin.create(
	{
		actions: {
			/**
			 * @returns {void}
			 */
			retry() {
				this.get('target').send('retry');
			},

			/**
			 * @param {number} pageNum
			 *
			 * @returns {void}
			 */
			loadPage(pageNum) {
				this.get('target').send('loadPage', pageNum);
			},

			/**
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
			 * @param {Object} categories
			 *
			 * @returns {void}
			 */
			applyFilters(sortBy, shouldShowReported, categories) {
				this.get('target').send('applyFilters', sortBy, shouldShowReported, categories);
			}
		}
	}
);
