App.DiscussionForumController = Em.Controller.extend({
	application: Em.inject.controller(),
	sortBy: null,

	smartBannerVisible: Em.computed.oneWay('application.smartBannerVisible'),

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

	sortMessageKey: Em.computed('sortBy', function () {
		const sortTypes = this.get('sortTypes'),
			filtered = sortTypes.filter((obj) => {
				return obj.name === this.get('sortBy');
			});

		return filtered.length ? filtered[0].messageKey : sortTypes[0].messageKey;
	}),

	actions: {
		/**
		 * @returns {void}
		 */
		showSortComponent() {
			this.set('sortVisible', true);
		},

		/**
		 * @returns {void}
		 */
		hideSortComponent() {
			this.set('sortVisible', false);
		},

		/**
		 * Bubbles up to DiscussionForumRoute
		 *
		 * @returns {void}
		 */
		retry() {
			this.get('target').send('retry');
		},

		/**
		 * Bubbles up to DiscussionForumRoute
		 *
		 * @returns {void}
		 */
		goToAllDiscussions() {
			this.get('target').send('goToAllDiscussions');
		}
	}
});
