/// <reference path="../app.ts" />
'use strict';

App.ArticleCommentsController = Ember.ArrayController.extend({
	needs: ['articleUsers'],
	itemController: 'articleComment'
});
