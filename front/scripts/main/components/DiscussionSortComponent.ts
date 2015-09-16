/// <reference path="../app.ts" />
'use strict';

App.DiscussionSortComponent = Em.Component.extend({
	classNames: ['discussion-sort', 'clearfix'],
	classNameBindings: ['isVisible::hide'],
	tagName: 'ul',

	// Whether the component is currently visible
	isVisible: false,

	sortByObserver: Em.observer('sortBy', function (): void {
		this.updateActive();
	}),

	didInsertElement: function (): void {
		this.updateActive();
		this._super();
	},

	updateActive: function (): void {
		// Add the 'active' CSS class to the sort tab that's active,
		// but right now this only applies to desktop styling.
		var $discussionSort = $('.discussion-sort');

		$discussionSort.find('li').removeClass('active');
		$discussionSort.find('li[data-type="' + this.get('sortBy') + '"]').addClass('active');
	},

	actions: {
		setSortBy(sortBy: string): void {
			// Send action up to route object
			this.sendAction('setSortBy', sortBy);
		}
	}
});
