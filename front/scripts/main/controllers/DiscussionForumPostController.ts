/// <reference path="../app.ts" />
'use strict';

App.DiscussionForumPostController = Em.Controller.extend({
	init: function () {
		// Enables vertical-colored theme bar in site-head component
		this.controllerFor('application').set('themeBar', true);
	}
});
