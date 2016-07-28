import Ember from 'ember';

export default Ember.Mixin.create(
	{
		classNames: ['forum-wrapper', 'discussion', 'forum'],
		currentlyLoadingPage: false,
		isLoading: true,
		pageNum: 0,
		postsDisplayed: 0,
		totalPosts: 0,
		maxAutoloadPagesNumber: 3,
		currentAutoloadPagesCounter: 0,

		hasMore: Ember.computed('totalPosts', 'postsDisplayed', function () {
			return this.get('totalPosts') > this.get('postsDisplayed');
		}),

		loadingPageResolveObserver: Ember.observer('postsDisplayed', 'minorError', function () {
			this.set('currentlyLoadingPage', false);
		}),

		/**
		 * @returns {void}
		 */
		didScroll() {
			if (this.get('hasMore') && !this.get('currentlyLoadingPage') &&
				this.get('maxAutoloadPagesNumber') > this.get('currentAutoloadPagesCounter') &&
				this.isScrolledToTrigger()
			) {
				this.incrementProperty('currentAutoloadPagesCounter');
				this.loadNextPage();
			}
		},

		loadNextPage() {
			this.setProperties({
				pageNum: this.pageNum + 1,
				currentlyLoadingPage: true,
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
		didInsertElement() {
			Ember.$(window).on(`scroll.${this.id}`, this.didScroll.bind(this));
		},

		/**
		 * @returns {void}
		 */
		willDestroyElement() {
			Ember.$(window).off(`scroll.${this.id}`);
		},
	}
);
