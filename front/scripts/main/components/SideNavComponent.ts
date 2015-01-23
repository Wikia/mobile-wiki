/// <reference path="../app.ts" />
'use strict';

App.SideNavComponent = Em.Component.extend({
	tagName: 'nav',
	classNames: ['side-nav'],
	classNameBindings: ['isCollapsed:collapsed:slide-into-view'],

	isCollapsed: true,
	isInSearchMode: false,
	searchQuery: '',

	actions: {
		clearSearch: function (): void {
			this.set('searchQuery', '');
		},

		collapse: function (): void {
			this.set('isCollapsed', true);
			this.send('searchCancel');
		},

		expand: function (): void {
			this.set('isCollapsed', false);
		},

		searchCancel: function (): void {
			this.set('isInSearchMode', false);
			this.send('clearSearch');
		},

		searchFocus: function (): void {
			this.set('isInSearchMode', true);
			// Track when search is opened
			M.track({
				action: M.trackActions.click,
				category: 'search'
			});
		},

		/**
		 * TODO: Refactor, use api
		 *
		 * Temporary solution for enter on search, will be refactored to be a route in mercury
		 * @param value of input
		 */
		enter: function (value = '') {
			window.location.assign('%@Special:Search?query=%@&fulltext=Search'.fmt(Mercury.wiki.articlePath, value));
		}
	},

	isCollapsedObserver: function () {
		var trackLabel: string = this.get('isCollapsed') ? 'close' : 'open';
		M.track({
			action: M.trackActions.click,
			category: 'menu',
			label: trackLabel
		});
	}.observes('isCollapsed'),

	/**
	 * Every time we exit search mode, regardless of if it was through the Cancel
	 * link or through clicking a search result, we want to clear out the query
	 * so that the search bar will clear.
	 */
	isInSearchModeObserver: function () {
		if (!this.get('isInSearchMode')) {
			this.send('clearSearch');
		}
	}.observes('isInSearchMode').on('didInsertElement')
});
