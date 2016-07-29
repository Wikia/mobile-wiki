import Ember from 'ember';

export default Ember.Mixin.create(
	{
		classNames: ['forum-wrapper', 'discussion', 'forum'],
		isLoading: false,
		pageNum: 0,
		postsDisplayed: 0,
		totalPosts: 0,
		minManualLoadPagesNumber: 3,
		manualLoadPagesCounter: 0,

		hasMore: Ember.computed('totalPosts', 'postsDisplayed', function () {
			return this.get('totalPosts') > this.get('postsDisplayed');
		}),

		showLoadMoreButton: Ember.computed('hasMore', 'manualLoadPagesCounter', function () {
			return this.get('hasMore') && this.get('manualLoadPagesCounter') < this.get('minManualLoadPagesNumber');
		}),

		autoScrollingOnObserver: Ember.observer('showLoadMoreButton', function () {
			if (!this.get('showLoadMoreButton')) {
				this.scrollOn();
			}
		}),

		loadingPageResolveObserver: Ember.observer('postsDisplayed', 'minorError', function () {
			this.set('isLoading', false);
		}),

		/**
		 * @returns {void}
		 */
		didScroll() {
			if (this.get('hasMore') && !this.get('isLoading') && this.isScrolledToTrigger()
			) {
				this.loadNextPage();
			}
		},

		scrollOff() {
			Ember.$(window).off(`scroll.${this.id}`, this.didScroll.bind(this));
		},

		scrollOn() {
			Ember.$(window).on(`scroll.${this.id}`, this.didScroll.bind(this));
		},

		loadNextPage() {
			this.setProperties({
				pageNum: this.pageNum + 1,
				isLoading: true,
			});

			this.sendAction('loadPage', this.pageNum);
		},

		/**
		 * Check if scrolling should trigger fetching new posts
		 *
		 * @returns {boolean}
		 */
		isScrolledToTrigger() {
			const windowHeight = $(window).height(),
				triggerDistance = 0.25 * windowHeight,
				distanceToViewportTop = $(document).height() - windowHeight,
				viewPortTop = $(document).scrollTop();

			return distanceToViewportTop - viewPortTop < triggerDistance;
		},

		/**
		 * @returns {void}
		 */
		willDestroyElement() {
			this.scrollOff();
		},

		actions: {
			loadNextPageAction() {
				this.incrementProperty('manualLoadPagesCounter');
				this.loadNextPage();
			},
		},
	}
);
