/// <reference path="../app.ts" />
'use strict';

/**
 * @desc Controller for the entire side nav, including the search/menu icon which
 * you click to expand the side nav. The search bar is rendered in the view for
 * this controller, so localWikiaSearch needs to be a child of it so SideNavView
 * can send actions to the search MVC.
 */
App.SideNavController = Em.Controller.extend({
	// Needs this so we can send search query to that controller
	needs: ['localWikiaSearch', 'localNavMenu'],
	isInSearchMode: false,
	isCollapsed: true,

	actions: {
		searchFocus: function (): void {
			this.set('isInSearchMode', true);
			// Track when search is opened
			Wikia.Utils.track('mercury-search', {
				trackingMethod: 'both',
				category: 'mercury',
				action: 'click',
				label: ''
			});
		},
		searchCancel: function (): void {
			this.set('isInSearchMode', false);
		},
		expand: function (): void {
			this.set('isCollapsed', false);
			Wikia.Utils.track('mercury-menu', {
				trackingMethod: 'both',
				category: 'mercury',
				action: 'click',
				label: 'open'
			});
		},
		collapse: function (): void {
			this.set('isCollapsed', true);
			// set the localNav to the root menu on close
			this.get('controllers.localNavMenu').send('gotoRoot');
			Wikia.Utils.track('mercury-menu', {
				trackingMethod: 'both',
				category: 'mercury',
				action: 'click',
				label: 'close'
			});
		}
	}
});
