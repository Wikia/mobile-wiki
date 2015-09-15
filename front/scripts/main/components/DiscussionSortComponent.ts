/// <reference path="../app.ts" />
'use strict';

App.DiscussionSortComponent = Em.Component.extend({
	classNames: ['discussion-sort'],
	classNameBindings: ['isVisible::hide'],
	tagName: 'ul',

	// Whether the component is currently visible
	isVisible: false,

	actions: {
		setSortBy(sortBy: string): void {
			// Send action up to route object
			this.sendAction('setSortBy', sortBy);
		}
	}
});

