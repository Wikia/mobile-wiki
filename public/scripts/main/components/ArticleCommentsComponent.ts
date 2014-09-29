/// <reference path="../app.ts" />
/// <reference path="../models/ArticleCommentsModel.ts" />
'use strict';

App.ArticleCommentsComponent = Em.Component.extend({
	page: null,
	articleId: null,
	commentsCount: null,
	classNames: ['article-comments'],
	model: null,

	isFirstPage: false,
	isLastPage: false,
	showComments: Em.computed.bool('page'),

	scrollToTop: function () {
		window.scrollTo(0, this.$('.comments').offset().top);
	},

	scrollToBottom: function () {
		window.scrollTo(0, this.$('.comments').offset().top + this.$('.comments').height());
	},

	didInsertElement: function () {
		this.set('model', App.ArticleCommentsModel.create({
			articleId: this.get('articleId'),
			page: this.get('page')
		}));
	},

	pageObserver: function () {
		var page = this.get('page'),
			count = this.get('model.pagesCount'),
			currentPage: number = page;

		if (page != null) {
			currentPage = Math.max(Math.min(page, count), 1);
		}

		this.setProperties({
			isFirstPage: currentPage === 1,
			isLastPage: currentPage === count,
			page: currentPage
		});

		this.set('model.page', currentPage);
	}.observes('page', 'model.pagesCount'),

	articleIdObserver: function () {
		this.setProperties({
			'model.articleId': this.get('articleId'),
			page: null
		})
	}.observes('articleId'),

	actions: {
		nextPage: function () {
			this.incrementProperty('page');
		},

		prevPage: function () {
			this.decrementProperty('page');
			console.log(this.get('articleId'))
		},

		toggleComments: function (): boolean {
			this.set('page', this.get('page') ? null : 1);
		}
	}
});
