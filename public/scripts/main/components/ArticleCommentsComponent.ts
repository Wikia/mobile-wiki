/// <reference path="../app.ts" />
/// <reference path="../models/ArticleCommentsModel.ts" />
'use strict';

App.ArticleCommentsComponent = Em.Component.extend({
	page: null,
	articleId: null,
	commentsCount: null,
	classNames: ['article-comments'],

	hidePrevButton: Em.computed.lt('currentPage', 1),
	hideNextButton: Em.computed.gt('currentPage', 'model.pagesCount'),
	showComments: false,

	scrollToTop: function () {
		window.scrollTo(0, this.$('.comments').offset().top);
	},

	scrollToBottom: function () {
		window.scrollTo(0, this.$('.comments').offset().top + this.$('.comments').height());
	},

	didInsertElement: function () {
		var model = App.ArticleCommentsModel.create({
			articleId: this.get('articleId'),
			page: this.get('currentPage')
		});

		model.addObserver('currentPage', this, () => {
			model.set('page', this.get('currentPage'))
		});

		console.log('render comments');
		this.set('model', model);
	},

	currentPage: function (key: string, value?: number) {
		if (value < 1) {
			return 1;
		} if (value > this.get('model.pagesCount')) {
			return this.get('model.pagesCount');
		}

		return value || this.getWithDefault('page', 1);
	}.property('page', 'model.pagesCount'),

	actions: {
		error: function (err: any) {
			Em.Logger.warn(err);
			return true;
		},

		loading: function () {
			return true;
		},

		nextPage: function () {
			this.incrementProperty('currentPage');
		},

		prevPage: function () {
			this.decrementProperty('currentPage');
		},

		toggleComments: function (): boolean {
			this.toggleProperty('showComments');
		}
	}
});
