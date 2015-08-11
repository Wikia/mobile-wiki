/// <reference path="../app.ts" />
'use strict';

App.DiscussionForumPostController = Em.Controller.extend({

	init: function () {
		this.controllerFor('application').set('noAds', true);
	},

	vertical: Em.computed(function (): string { return Mercury.wiki.vertical; }),
	showMore: true,

	actions: {
		expand: function() {
//			debugger;
			var model = this.get('model');
			model.loadNextPage();

			if (model.replies.length >= model.postCount) {
				this.set('showMore', false);
			}
		},
	}
});
