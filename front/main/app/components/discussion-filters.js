import Ember from 'ember';
import nearestParent from 'ember-pop-over/computed/nearest-parent';

export default Ember.Component.extend(
	{
		classNames: ['discussion-filters'],
		sortBy: Ember.computed.oneWay('discussionSort.sortBy'),
		onlyReported: Ember.computed.oneWay('discussionSort.onlyReported'),
		discussionSort: Ember.inject.service(),

		popover: nearestParent('pop-over'),

		actions: {
			applyFilters() {
				const sortBy = this.get('sortBy'),
					onlyReported = this.get('onlyReported');
					this.attrs.applyFilters(sortBy, onlyReported);
					this.get('popover').deactivate();
			},

			setSortBy(sortBy) {
				this.set('sortBy', sortBy);
			},

			toggleOnlyReported(event) {
				const isCheckboxChecked = event.target.checked;

				if (isCheckboxChecked !== this.get('onlyReported')) {
					this.set('onlyReported', isCheckboxChecked);
				}
			}
		}
	}
);
