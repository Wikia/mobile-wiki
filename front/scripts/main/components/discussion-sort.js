import App from '../app';

export default App.DiscussionSortComponent = Ember.Component.extend({
	classNames: ['discussion-sort', 'clearfix'],
	classNameBindings: ['sortVisible::mobile-hidden'],
	tagName: 'ul',

	// Whether the component is currently visible
	sortVisible: false,

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
