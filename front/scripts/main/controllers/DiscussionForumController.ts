/// <reference path="../app.ts" />

App.DiscussionForumController = Em.Controller.extend({
	needs: 'application',
	sortBy: null,

	// Whether the sort component is currently visible
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

	sortMessageKey: Em.computed('sortBy', function (): string {
		var sortTypes = this.get('sortTypes'),
			filtered = sortTypes.filter((obj: any): boolean => {
				return obj.name === this.get('sortBy');
			});

			return filtered.length ? filtered[0].messageKey :
				sortTypes[0].messageKey;
	}),

	actions: {
		showSortComponent(): void {
			this.set('sortVisible', true);
		},

		hideSortComponent(): void {
			this.set('sortVisible', false);
		}
	}
});
