import Ember from 'ember';

const DiscussionSortComponent = Ember.Component.extend({
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
		const $discussionSort = this.get('$discussionSort');

		if ($discussionSort === null) {
			return;
		}

		$discussionSort.find('li.active').removeClass('active');
		$discussionSort.find(`li[data-type="${this.get('sortBy')}"]`).addClass('active');
	},
});

export default DiscussionSortComponent;
