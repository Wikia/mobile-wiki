/// <reference path="../app.ts" />
'use strict';

App.SideNavView = Em.View.extend({
	tagName: 'nav',
	classNames: ['side-nav'],
	classNameBindings: ['isCollapsed::slide-into-view'],
	isCollapsed: true,
	layoutName: 'app/side-nav',

	actions: {
		expandSideNav: function (): void {
			this.set('isCollapsed', false);
			// Send unscroll action to ApplicationView
			this.get('parentView').send('setUnScrollable');
		},
		collapseSideNav: function (): void {
			this.set('controller.isInSearchMode', false);
			this.set('isCollapsed', true);
			this.get('parentView').send('setScrollable');
		},
		/**
		 * Action for 'x' button in search box
		 */
		clearSearch: function (): void {
			this.set('controller.controllers.localWikiaSearch.query', '');
		}
	},

	/**
	 * Every time we exit search mode, regardless of if it was through the Cancel
	 * link or through clicking a search result, we want to clear out the query
	 * so that the search bar will clear.
	 */
	searchModeObserver: function () {
		if (!this.get('isInSearchMode')) {
			this.set('controllers.localWikiaSearch.query', '');
		}
	},

	didInsertElement: function () {
		this.get('controller').addObserver('isInSearchMode', this.searchModeObserver);
	},

	willDestroy: function () {
		this.get('controller').removeObserver('isInSearchMode', this.searchModeObserver);
	}
});
