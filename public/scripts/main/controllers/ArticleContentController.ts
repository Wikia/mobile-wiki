/// <reference path="../app.ts" />
'use strict';

App.ArticleContentController = Em.ObjectController.extend({
	actions: {
		changePage: function () {
			// return true for event to bubble up to ArticleController action changePage
			return true;
		}
	}
});

