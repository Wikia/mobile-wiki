/// <reference path="../app.ts" />
'use strict';

Wikia.WikiArticleController = Em.ObjectController.extend({
	actions: {
		updateHeaders: function (headers): void {
		   var article = this.get('model');
		   article.set('headers', headers);
		}
	}
});
