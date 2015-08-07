/// <reference path="../app.ts" />
'use strict';

App.DiscussionForumPostController = Em.Controller.extend({
	init: function () {
		this.controllerFor('application').set('noAds', true);
	}
});
