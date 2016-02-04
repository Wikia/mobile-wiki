import Ember from 'ember';
import nearestParent from "ember-pop-over/computed/nearest-parent";

export default Ember.Component.extend(
	{
		classNames: ['discussion-filters'],
		discussionSort: Ember.inject.service(),
		sortBy: Ember.computed.oneWay('discussionSort.sortBy'),

		popover: nearestParent('pop-over'),

		actions: {
			applyFilters() {
				const sortBy = this.get('sortBy');
				if (this.get('discussionSort.sortBy') !== sortBy) {
					this.attrs.applyFilters(sortBy);
					this.get('popover').deactivate();
				}
			},

			setSortBy(sortBy) {
				this.set('sortBy', sortBy);
			}
		}
	}
);
