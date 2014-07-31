/// <reference path="../app.ts" />
'use strict';

App.SideNavController = Em.Controller.extend({
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
