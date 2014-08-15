/// <reference path="../app.ts" />
'use strict';

App.SideNavView = Em.View.extend({
	tagName: 'nav',
	classNames: ['side-nav'],
	classNameBindings: ['isCollapsed:hidden:slide-into-view'],
	isCollapsed: true,
	layoutName: 'app/side-nav',

	actions: {
		expandSideNav: function (): void {
			this.set('isCollapsed', false);
			Ember.$('body').addClass('no-scroll');
		},
		collapseSideNav: function (): void {
			console.log('collapsing');
			this.set('controller.isInSearchMode', false);
			this.set('isCollapsed', true);
			Ember.$('body').removeClass('no-scroll');
		},
		/**
		 * Action for 'x' button in search box -- not sure what
		 * it's supposed to do but right now it clears the text.
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
