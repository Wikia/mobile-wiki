/// <reference path="../app.ts" />

'use strict';

App.ArticleCommentView = Em.View.extend({
	tagName: 'li',
	classNames: ['comment'],
	templateName: ['article/comment']
});
