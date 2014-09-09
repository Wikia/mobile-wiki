/// <reference path="../app.ts" />
/// <reference path="../models/ArticleCommentsModel.ts" />
'use strict';

App.ArticleCommentsController = Em.ArrayController.extend({
	needs: ['article'],
	itemController: 'articleComment',

	commentsPage: Em.computed.alias(
		'controllers.article.commentsPage'
	),

	commentsPageObserver: function () {
		var commentsPage = this.get('commentsPage'),
			model = this.get('model');

		if (commentsPage < 1) {
			this.set('commentsPage', 1);
		} if (commentsPage >= this.get('model.pagesCount')) {
			this.set('commentsPage', this.get('model.pagesCount'));
		} else if (model.get('page').toString() !== commentsPage.toString()){
			model.set('page', commentsPage);
		}
	}.observes('commentsPage'),

	showPrevButton: Em.computed.gt('commentsPage', 1),
	showNextButton: Em.computed.lt('commentsPage', 'model.pagesCount'),

	commentsHidden: Em.computed.none('commentsPage'),

	articleId: Em.computed.alias(
		'controllers.article.model.id'
	),

	init: function () {
		var model = App.ArticleCommentsModel.create({
			articleId: this.get('articleId'),
			page: this.get('commentsPage')
		});

		model.addObserver('pagesCount', this.commentsPageObserver);

		this.set('model', model);
	},

	actions: {
		error: function (err: any) {
			Em.Logger.warn(err);
			return true;
		},
		loading: function () {
			return true;
		},

		nextPage: function () {
			this.incrementProperty('commentsPage');
		},

		prevPage: function () {
			this.decrementProperty('commentsPage');
		}
	}
});

