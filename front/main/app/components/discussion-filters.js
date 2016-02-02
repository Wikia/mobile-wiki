import Ember from 'ember';

export default Ember.Component.extend(
	{
		classNames: ['discussion-filters'],
		discussionSort: Ember.inject.service(),
		sortBy: Ember.computed.oneWay('discussionSort.sortBy'),

		actions: {
			filtersApply() {
				const sortBy = this.get('sortBy');

				if (this.get('discussionSort.sortBy') !== sortBy) {
					this.attrs.filtersApply(sortBy);
				}
			},

			setSortBy(sortBy) {
				this.set('sortBy', sortBy);
			}
		}
	}
);
