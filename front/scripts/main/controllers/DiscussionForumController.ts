/// <reference path="../app.ts" />

App.DiscussionForumController = Em.Controller.extend({
	sortBy: null,
	// Whether the sort component is currently visible
	sortVisible: false,
	// Whether the sort component should always be visible
	sortAlwaysVisible: false,

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

	sortMessageKey: Em.computed('sortBy', function (): string {
		var sortTypes = this.get('sortTypes'),
			filtered = sortTypes.filter((obj: any): boolean => {
				return obj.name === this.get('sortBy');
			});

			return filtered.length ? filtered[0].messageKey :
				sortTypes[0].messageKey;
	}),

	actions: {
		showSortSelector(): void {
			this.set('sortVisible', true);
		},

		hideSortSelector(): void {
			this.set('sortVisible', false);
		}
	}
});
