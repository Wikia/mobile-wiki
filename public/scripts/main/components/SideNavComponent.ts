/// <reference path="../app.ts" />
'use strict';

App.SideNavComponent = Em.Component.extend({
	tagName: 'nav',
	classNames: ['side-nav'],
	classNameBindings: ['isCollapsed:collapsed:slide-into-view'],
	//isCollapsed: Em.computed.alias('controller.isCollapsed'),

	actions: {
		/**
		 * Action for 'x' button in search box
		 */
		clearSearch: function (): void {
			//this.set('controller.controllers.localWikiaSearch.query', '');
		}
	},

	isCollapsedObserver: function () {
		if (this.get('isCollapsed')) {
			//this.set('controller.isInSearchMode', false);
			//this.get('parentView').send('setScrollable');
		} else {
			//this.get('parentView').send('setUnscrollable');
		}
	}.observes('isCollapsed').on('didInsertElement'),

	/**
	 * Every time we exit search mode, regardless of if it was through the Cancel
	 * link or through clicking a search result, we want to clear out the query
	 * so that the search bar will clear.
	 */
	searchModeObserver: function () {
		if (!this.get('isInSearchMode')) {
			this.send('clearSearch');
		}
	}.observes('controller.isInSearchMode').on('didInsertElement')
});
