import Ember from 'ember';

const {computed, Mixin, inject: {service}} = Ember;

export default Mixin.create({
	discussionSort: service(),
	onlyReported: computed.oneWay('discussionSort.onlyReported'),
	showApplyButton: false,
	sortBy: computed.oneWay('discussionSort.sortBy'),

	actions: {
		/**
		 * @param {string} sortBy
		 *
		 * @returns {void}
		 */
		setSortBy(sortBy) {
			this.set('sortBy', sortBy);
		},

		/**
		 * @returns {void}
		 */
		toggleReported() {
			const onlyReported = this.get('onlyReported');

			this.set('onlyReported', !onlyReported);

			if (!this.get('showApplyButton')) {
				this.get('applyFilters')(
					this.get('sortBy'),
					this.get('onlyReported'),
					[]
				);
			}
		},
	},
});
