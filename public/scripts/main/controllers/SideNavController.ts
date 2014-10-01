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
	needs: ['localWikiaSearch'],
	isInSearchMode: false,
	actions: {
		searchFocus: function () {
			this.set('isInSearchMode', true);
		},
		searchCancel: function () {
			this.set('isInSearchMode', false);
		}
	}
});
