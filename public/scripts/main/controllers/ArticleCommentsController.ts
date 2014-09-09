/// <reference path="../app.ts" />
'use strict';

App.ArticleCommentsController = Em.ArrayController.extend({
	needs: ['articleUsers'],
	itemController: 'articleComment'
});

