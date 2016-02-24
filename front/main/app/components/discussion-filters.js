import Ember from 'ember';
import nearestParent from 'ember-pop-over/computed/nearest-parent';

export default Ember.Component.extend(
	{
		classNames: ['discussion-filters'],
		discussionSort: Ember.inject.service(),
		onlyReported: Ember.computed.oneWay('discussionSort.onlyReported'),
		popover: nearestParent('pop-over'),
		sortBy: Ember.computed.oneWay('discussionSort.sortBy'),

		actions: {
			/**
			 * Form handler
			 *
			 * @returns {void}
			 */
			applyFilters() {
				const sortBy = this.get('sortBy'),
					onlyReported = this.get('onlyReported');

				this.attrs.applyFilters(sortBy, onlyReported);
				this.get('popover').deactivate();
			},

			/**
			 * @param {string} sortBy
			 *
			 * @returns {void}
			 */
			setSortBy(sortBy) {
				this.set('sortBy', sortBy);
			},

			/**
			 * Sets onlyReported flag in sync with onlyReported checkbox
			 *
			 * @param {event} event
			 *
			 * @returns {void}
			 */
			toggleOnlyReported(event) {
				const isCheckboxChecked = event.target.checked;

				if (isCheckboxChecked !== this.get('onlyReported')) {
					this.set('onlyReported', isCheckboxChecked);
				}
			}
		}
	}
);
