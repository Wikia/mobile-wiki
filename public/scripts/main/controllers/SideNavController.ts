/// <reference path="../app.ts" />
'use strict';

App.SideNavController = Em.Controller.extend({
	needs: 'localWikiaSearch',
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
