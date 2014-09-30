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

	/**
	 * @desc scrolls to top of article's container, used for pagination
	 */
	scrollToTop: function (): void {
		window.scrollTo(0, this.$().offset().top);
	},

	didInsertElement: function (): void {
		this.set('model', App.ArticleCommentsModel.create({
			articleId: this.get('articleId')
		}));

		if (this.get('page')) {
			this.scrollToTop();
		}
	},

	/**
	 * @desc observes changes to page property, applies limit `1 <= page <= model.pagesCount`
	 * and updates model, so it can load a page of comments
	 */
	pageObserver: function (): void {
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

	/**
	 * @desc watches changes to model, and scrolls to top of comments
	 */
	commentsObserver: function (): void {
		if (this.get('model.comments')) {
			this.scrollToTop();
		}
	}.observes('model.comments'),

	/**
	 * @desc if articleId changes, updates model
	 */
	articleIdObserver: function (): void {
		this.setProperties({
			'model.articleId': this.get('articleId'),
			page: null
		});

		this.rerender();
	}.observes('articleId'),

	actions: {
		nextPage: function (): void {
			this.incrementProperty('page');
		},

		prevPage: function (): void {
			this.decrementProperty('page');
		},

		toggleComments: function (): void {
			this.set('page', this.get('page') ? null : 1);
		}
	}
});
