/// <reference path="../app.ts" />
'use strict';

App.ArticleContentComponent = Em.Component.extend({
	tagName: 'article',
	classNames: ['article-content'],
	actions: {
		// return true for event to bubble up to ArticleController action changePage
		changePage: () => true
	}
});
