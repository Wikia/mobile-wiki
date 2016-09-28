import Ember from 'ember';

export default Ember.Mixin.create(
	{
		queryParams: ['page'],

		page: 1,

		pageUpdater: Ember.observer('model.current.data.pageNum', function () {
			this.set('page', this.get('model.current.data.pageNum') + 1);
		}),

		actions: {
			/**
			 * @returns {void}
			 */
			retry() {
				this.get('target').send('retry');
			},

			/**
			 * @param {number} page
			 *
			 * @returns {void}
			 */
			loadPage(page) {
				this.get('target').send('loadPage', page);
			},

			/**
			 * @param {number} page
			 *
			 * @returns {void}
			 */
			goToPage(page = 1) {
				this.get('target').send('goToPage', page);
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
			 * @param {Object} catId
			 * @param {Object} changeState
			 *
			 * @returns {void}
			 */
			applyFilters(sortBy, shouldShowReported, catId, changeState) {
				this.get('target').send('applyFilters', sortBy, shouldShowReported, catId, changeState);
			}
		}
	}
);
