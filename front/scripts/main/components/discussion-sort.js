export default Ember.Component.extend({
	classNames: ['discussion-sort', 'clearfix'],
	classNameBindings: ['sortVisible::mobile-hidden'],
	tagName: 'ul',

	discussionSort: Ember.inject.service(),

	// Whether the component is currently visible
	sortVisible: Ember.computed.oneWay('discussionSort.sortVisible'),
	sortTypes: Ember.computed.oneWay('discussionSort.sortTypes'),

	actions: {
		/**
		 * @param {string} sortBy
		 * @returns {void}
		 */
		setSortBy(sortBy) {
			// Send action up to route object
			this.sendAction('setSortBy', sortBy);
		},
	},
});
