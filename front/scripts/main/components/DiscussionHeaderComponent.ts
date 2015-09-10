/// <reference path="../app.ts" />
/// <reference path="../../main/mixins/HeadroomMixin.ts" />
'use strict';

App.DiscussionHeaderComponent = Em.Component.extend(App.HeadroomMixin, {
	classNames: ['discussion-header'],

	sortBy: null,
	sortVisible: false,
	sortTypes: [
		{
			name: 'latest',
			messageKey: 'discussion.sort-by-latest'
		},
		{
			name: 'trending',
			messageKey: 'discussion.sort-by-trending'
		}
	],
	siteName: Mercury.wiki.siteName,

	sortMessageKey: Em.computed('sortBy', function (): string {
		var sortTypes = this.get('sortTypes'),
			filtered = sortTypes.filter((obj: any): boolean => {
				return obj.name === this.get('sortBy');
			});

			return filtered.length ? filtered[0].messageKey :
				sortTypes[0].messageKey;
	}),

	actions: {
		setSortBy(sortBy: string): void {
			// Send action up to route object
			this.sendAction('setSortBy', sortBy);
		},

		showSortSelector(): void {
			this.set('sortVisible', true);
		},

		hideSortSelector(): void {
			this.set('sortVisible', false);
		}
	}
});
