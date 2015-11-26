import App from '../app';

export default App.DiscussionSortComponent = Ember.Component.extend({
	classNames: ['discussion-sort', 'clearfix'],
	classNameBindings: ['sortVisible::mobile-hidden'],
	tagName: 'ul',

	// Whether the component is currently visible
	sortVisible: false,
	// jQuery object for this component
	$discussionSort: null,

	sortByObserver: Ember.observer('sortBy', function () {
		this.updateActive();
	}),

	/**
	 * @returns {void}
	 */
	didInsertElement() {
		this.set('$discussionSort', $('.discussion-sort'));
		this.updateActive();
		this._super();
	},

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

	/**
	 * @returns {void}
	 */
	updateActive() {
		// Add the 'active' CSS class to the sort tab that's active,
		// but right now this only applies to desktop styling.
		const $discussionSort = this.get('$discussionSort'),
			activeClass = 'active active-element-theme-color active-element-border-theme-color',
			notActiveClass = 'not-active';

		if ($discussionSort === null) {
			return;
		}

		$discussionSort.find('li.active').removeClass(activeClass).addClass(notActiveClass);
		$discussionSort
			.find(`li[data-type="${this.get('sortBy')}"]`)
			.removeClass(notActiveClass)
			.addClass(activeClass);
	},
});
