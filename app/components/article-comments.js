import { inject as service } from '@ember/service';
import { bool } from '@ember/object/computed';
import Component from '@ember/component';
import { observer } from '@ember/object';
import { run } from '@ember/runloop';
import { getOwner } from '@ember/application';
import ArticleCommentsModel from '../models/article-comments';
import { track, trackActions } from '../utils/track';
import scrollToTop from '../utils/scroll-to-top';

/**
 * Component that displays article comments
 *
 * Subject to refactor as it uses observers instead of computed properties
 *
 * TODO: Great refactor XW-1237
 */
export default Component.extend(
	{
		wikiVariables: service(),
		page: null,
		articleId: null,
		commentsCount: null,
		classNames: ['article-comments', 'mw-content'],
		model: null,
		isCollapsed: true,

		nextButtonShown: false,
		prevButtonShown: false,
		showComments: bool('page'),

		/**
		 * observes changes to page property, applies limit `1 <= page <= model.pagesCount`
		 * and updates model, so it can load a page of comments
		 */
		pageObserver: observer('page', 'model.comments', function () {
			run.scheduleOnce('afterRender', this, () => {
				const page = this.page,
					count = this.get('model.pagesCount');

				let currentPage = page,
					currentPageInteger,
					isFirstPage;

				// since those can be null we intentionally correct the types
				if (page !== null && count !== null) {
					currentPage = Math.max(Math.min(page, count), 1);
				}

				currentPageInteger = parseInt(currentPage, 10);
				isFirstPage = currentPageInteger === 1;

				this.setProperties({
					nextButtonShown: (isFirstPage || currentPageInteger < count) && count > 1,
					prevButtonShown: !isFirstPage && (currentPageInteger > 1),
					page: currentPage
				});

				this.set('model.page', currentPage);
			});
		}),

		/**
		 * watches changes to model, and scrolls to top of comments
		 */
		commentsObserver: observer('model.comments', function () {
			if (this.get('model.comments')) {
				scrollToTop(this.element);
			}
		}),

		/**
		 * if articleId changes, updates model
		 */
		articleIdObserver: observer('articleId', function () {
			this.setProperties({
				'model.articleId': this.articleId,
				page: null
			});

			this.rerender();
		}),

		/**
		 * Sets model when we get new articleId
		 *
		 * @returns {void}
		 */
		init() {
			this._super(...arguments);

			this.set('model', ArticleCommentsModel.create(getOwner(this).ownerInjection(), {
				articleId: this.articleId,
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
		didRender() {
			const page = this.page;

			this._super(...arguments);

			if (page) {
				this.set('model.page', page);
				scrollToTop(this.element);
			}
		},

		actions: {
			/**
			 * @returns {void}
			 */
			nextPage() {
				this.incrementProperty('page');
			},

			/**
			 * @returns {void}
			 */
			prevPage() {
				this.decrementProperty('page');
			},

			/**
			 * @returns {void}
			 */
			toggleComments() {
				this.set('page', this.page ? null : 1);
				this.toggleProperty('isCollapsed');

				track({
					action: trackActions.click,
					category: 'comments',
					label: this.page ? 'expanded' : 'collapsed'
				});
			}
		}
	}
);
