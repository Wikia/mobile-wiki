/// <reference path="../app.ts" />

'use strict';
Wikia.WikiArticleView = Em.View.extend({
	classNames: ['article-body'],
	didInsertElement: function () {
		console.log('Wiki Article View inserted, party time');
		console.log(this);
	}
});
