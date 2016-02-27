import Ember from 'ember';
import nearestParent from 'ember-pop-over/computed/nearest-parent';

export default Ember.Component.extend(
	{
		classNames: ['discussion-filters'],
		discussionSort: Ember.inject.service(),
		onlyReported: Ember.computed.oneWay('discussionSort.onlyReported'),
		popover: nearestParent('pop-over'),
		sortBy: Ember.computed.oneWay('discussionSort.sortBy'),

		onlyReportedClassName: Ember.computed('onlyReported', function () {
			return this.get('onlyReported') === true ? 'active-element-background-color' : null;
		}),

		actions: {
			/**
			 * Form handler
			 *
			 * @returns {void}
			 */
			applyFilters() {
				const sortBy = this.get('sortBy'),
					onlyReported = this.get('onlyReported'),
					discussionSort = this.get('discussionSort');

				// No need for applying already applied filters again
				if (sortBy !== discussionSort.get('sortBy') || onlyReported !== discussionSort.get('onlyReported')) {
					this.attrs.applyFilters(this.get('sortBy'), this.get('onlyReported'));
				}

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
