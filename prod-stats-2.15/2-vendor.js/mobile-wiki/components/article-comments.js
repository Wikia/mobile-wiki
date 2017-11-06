define('mobile-wiki/components/article-comments', ['exports', 'mobile-wiki/models/article-comments', 'mobile-wiki/utils/track'], function (exports, _articleComments, _track) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Component = Ember.Component,
	    computed = Ember.computed,
	    inject = Ember.inject,
	    observer = Ember.observer,
	    run = Ember.run,
	    getOwner = Ember.getOwner;
	exports.default = Component.extend({
		wikiVariables: inject.service(),
		page: null,
		articleId: null,
		commentsCount: null,
		classNames: ['article-comments', 'mw-content'],
		model: null,
		isCollapsed: true,

		nextButtonShown: false,
		prevButtonShown: false,
		showComments: computed.bool('page'),

		/**
   * observes changes to page property, applies limit `1 <= page <= model.pagesCount`
   * and updates model, so it can load a page of comments
   */
		pageObserver: observer('page', 'model.comments', function () {
			var _this = this;

			run.scheduleOnce('afterRender', this, function () {
				var page = _this.get('page'),
				    count = _this.get('model.pagesCount');

				var currentPage = page,
				    currentPageInteger = void 0,
				    isFirstPage = void 0;

				// since those can be null we intentionally correct the types
				if (page !== null && count !== null) {
					currentPage = Math.max(Math.min(page, count), 1);
				}

				currentPageInteger = parseInt(currentPage, 10);
				isFirstPage = currentPageInteger === 1;

				_this.setProperties({
					nextButtonShown: (isFirstPage || currentPageInteger < count) && count > 1,
					prevButtonShown: !isFirstPage && currentPageInteger > 1,
					page: currentPage
				});

				_this.set('model.page', currentPage);
			});
		}),

		/**
   * watches changes to model, and scrolls to top of comments
   */
		commentsObserver: observer('model.comments', function () {
			if (this.get('model.comments')) {
				this.scrollToTop();
			}
		}),

		/**
   * if articleId changes, updates model
   */
		articleIdObserver: observer('articleId', function () {
			this.setProperties({
				'model.articleId': this.get('articleId'),
				page: null
			});

			this.rerender();
		}),

		/**
   * Sets model when we get new articleId
   *
   * @returns {void}
   */
		init: function init() {
			this._super.apply(this, arguments);

			this.set('model', _articleComments.default.create(getOwner(this).ownerInjection(), {
				articleId: this.get('articleId'),
				host: this.get('wikiVariables.host')
			}));
		},


		/**
   * If we recieved page on didRender
   * that means there is a query param comments_page
   * and we should load comments and scroll to them
   *
   * @returns {void}
   */
		didRender: function didRender() {
			var page = this.get('page');

			this._super.apply(this, arguments);

			if (page) {
				this.set('model.page', page);
				this.scrollToTop();
			}
		},


		actions: {
			/**
    * @returns {void}
    */
			nextPage: function nextPage() {
				this.incrementProperty('page');
			},


			/**
    * @returns {void}
    */
			prevPage: function prevPage() {
				this.decrementProperty('page');
			},


			/**
    * @returns {void}
    */
			toggleComments: function toggleComments() {
				this.set('page', this.get('page') ? null : 1);
				this.toggleProperty('isCollapsed');

				(0, _track.track)({
					action: _track.trackActions.click,
					category: 'comments',
					label: this.get('page') ? 'expanded' : 'collapsed'
				});
			}
		},

		/**
   * scrolls to top of article's container, used for pagination
   *
   * @returns {void}
   */
		scrollToTop: function scrollToTop() {
			window.scrollTo(0, this.$().offset().top);
		}
	});
});