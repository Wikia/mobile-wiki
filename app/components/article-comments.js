import { inject as service } from '@ember/service';
import { bool, equal } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { run } from '@ember/runloop';
import { getOwner } from '@ember/application';
import ArticleCommentsModel from '../models/article-comments';
import { track, trackActions } from '../utils/track';
import scrollToTop from '../utils/scroll-to-top';

/**
 * Component that displays article comments
 *
 * Subject to refactor as it uses observers instead of computed properties
 */
export default Component.extend(
	{
		preserveScroll: service(),
		wikiVariables: service(),
		page: null,
		articleId: null,
		commentsCount: null,
		classNames: ['article-comments', 'mw-content'],
		model: null,
		isCollapsed: true,

		showComments: bool('page'),
		prevButtonDisabled: equal('page', 1),
		nextButtonDisabled: computed('page', 'model.pagesCount', function () {
			return this.get('page') >= this.get('model.pagesCount');
		}),
		currentPage: computed('page', 'model.pagesCount', function () {
			const page = this.get('page'),
				count = this.get('model.pagesCount');

			let currentPage = page;

			// since those can be null we intentionally correct the types
			if (page !== null && count !== null) {
				currentPage = Math.max(Math.min(page, count), 1);
			}

			if (page !== currentPage) {
				this.set('page', currentPage);
			}

			return currentPage;
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
				this.set('model.page', this.get('currentPage'));
				this.set('isCollapsed', false);
				// TODO: uncomment it when didRender will be invoked only once after togling comments menu
				// scrollToTop(this.element);
			}
		},

		actions: {
			/**
			 * @returns {void}
			 */
			nextPage() {
				this.set('preserveScroll.preserveScrollPosition', true);
				this.incrementProperty('page');
				this.set('model.page', this.get('currentPage'));
				scrollToTop(this.element);
			},

			/**
			 * @returns {void}
			 */
			prevPage() {
				this.set('preserveScroll.preserveScrollPosition', true);
				this.decrementProperty('page');
				this.set('model.page', this.get('currentPage'));
				scrollToTop(this.element);
			},

			/**
			 * @returns {void}
			 */
			toggleComments() {
				this.set('preserveScroll.preserveScrollPosition', true);
				this.set('page', this.page ? null : 1);
				this.set('model.page', this.get('currentPage'));
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
