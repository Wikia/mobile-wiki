/// <reference path="../app.ts" />
'use strict';

App.DiscussionSortComponent = Em.Component.extend({
	classNames: ['discussion-sort', 'clearfix'],
	classNameBindings: ['sortVisible::mobile-hidden'],
	tagName: 'ul',

	// Whether the component is currently visible
	sortVisible: false,
	// jQuery object for this component
	$discussionSort: null,

	sortByObserver: Em.observer('sortBy', function (): void {
		this.updateActive();
	}),

	didInsertElement(): void {
		this.set('$discussionSort', $('.discussion-sort'));
		this.updateActive();
		this._super();
	},

	updateActive(): void {
		// Add the 'active' CSS class to the sort tab that's active,
		// but right now this only applies to desktop styling.
		var $discussionSort: JQuery = this.get('$discussionSort');

		if ($discussionSort === null) {
			return;
		}

		$discussionSort.find('li.active').removeClass('active');
		$discussionSort.find('li[data-type="' + this.get('sortBy') + '"]').addClass('active');
	},

	actions: {
		setSortBy(sortBy: string): void {
			// Send action up to route object
			this.sendAction('setSortBy', sortBy);
		}
	}
});
