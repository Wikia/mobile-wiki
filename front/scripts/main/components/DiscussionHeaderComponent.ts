/// <reference path="../app.ts" />
/// <reference path="../../main/mixins/HeadroomMixin.ts" />
'use strict';

App.DiscussionHeaderComponent = Em.Component.extend(App.HeadroomMixin, {
	classNames: ['discussion-header'],

	siteName: Em.computed(function (): string {
		return Em.get(Mercury, 'wiki.siteName');
	}),

	actions: {
		showSortComponent(): void {
			this.sendAction('showSortComponent');
		},

		hideSortComponent(): void {
			this.sendAction('hideSortComponent');
		}
	}
});
