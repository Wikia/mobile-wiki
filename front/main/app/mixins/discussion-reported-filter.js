import Ember from 'ember';

export default Ember.Mixin.create({
	discussionSort: Ember.inject.service(),
	onlyReported: Ember.computed.oneWay('discussionSort.onlyReported'),
	showApplyButton: false,
	sortBy: Ember.computed.oneWay('discussionSort.sortBy'),

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
		 * @param {Event} event
		 *
		 * @returns {void}
		 */
		toggleReported(event) {
			event.preventDefault();

			const onlyReported = this.get('onlyReported');

			if (onlyReported === false) {
				this.send('setSortBy', 'latest');
			}

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
