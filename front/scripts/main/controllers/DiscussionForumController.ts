/// <reference path="../app.ts" />

App.DiscussionForumController = Em.Controller.extend({
	application: Em.inject.controller(),
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

		/**
		 * @returns {void}
		 */
		showSortComponent(): void {
			this.set('sortVisible', true);
		},

		/**
		 * @returns {void}
		 */
		hideSortComponent(): void {
			this.set('sortVisible', false);
		},

		/**
		 * Bubbles up to DiscussionForumRoute
		 *
		 * @returns {void}
		 */
		retry(): void {
			this.get('target').send('retry');
		},

		/**
		 * Bubbles up to DiscussionForumRoute
		 *
		 * @returns {void}
		 */
		goToAllDiscussions(): void {
			this.get('target').send('goToAllDiscussions');
		}
	}
});
