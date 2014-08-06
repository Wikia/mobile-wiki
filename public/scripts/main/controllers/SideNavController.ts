/// <reference path="../app.ts" />
'use strict';

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
