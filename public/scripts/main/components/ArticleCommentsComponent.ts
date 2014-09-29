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
		window.scrollTo(0, this.$().offset().top);
	},

	didInsertElement: function () {
		this.set('model', App.ArticleCommentsModel.create({
			articleId: this.get('articleId')
		}));

		if (this.get('page')) {
			this.scrollToTop();
		}
	},

	pageObserver: function () {
		var page = this.get('page'),
			count = this.get('model.pagesCount'),
			currentPage: number = page;

		if (page != null && count != null) {
			currentPage = Math.max(Math.min(page, count), 1);
		}

		this.setProperties({
			isFirstPage: currentPage === 1,
			isLastPage: currentPage === count,
			page: currentPage
		});

		this.set('model.page', currentPage);
	}.observes('page', 'model.pagesCount'),

	commentsObserver: function () {
		this.scrollToTop();
	}.observes('model.comments'),

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
		},

		toggleComments: function (): boolean {
			this.set('page', this.get('page') ? null : 1);
		}
	}
});
