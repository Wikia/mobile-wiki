/// <reference path="../app.ts" />
'use strict';

Wikia.WikiArticleController = Em.ObjectController.extend({
	actions: {
		test: function (): void {
			console.log(this);
		}
	}
});
