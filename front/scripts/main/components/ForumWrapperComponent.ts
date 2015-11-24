/// <reference path="../app.ts" />
/// <reference path="../mixins/DiscussionUpvoteActionSendMixin.ts" />
'use strict';

App.ForumWrapperComponent = Em.Component.extend(
	App.DiscussionUpvoteActionSendMixin,
	{
		classNames: ['forum-wrapper', 'discussion', 'forum'],
		postsDisplayed: 0,
		totalPosts: 0,
		pageNum: null,
		currentlyLoadingPage: false,
		isLoading: true,

		hasMore: Em.computed('totalPosts', 'postsDisplayed', function (): boolean {
			return this.get('totalPosts') > this.get('postsDisplayed');
		}),

		pageLoaded: Em.observer('postsDisplayed', function (): void {
			this.set('currentlyLoadingPage', false);
		}),

		minorErrorObserver: Em.observer('minorError', function (): void {
			this.set('currentlyLoadingPage', false);
		}),

		actions: {
			/**
			 * @param {number} postId
			 * @returns {void}
			 */
			goToPost(postId: number): void {
				this.sendAction('goToPost', postId);
			},

			/**
			 * @param {string} sortBy
			 * @returns {void}
			 */
			setSortBy(sortBy: string): void {
				this.sendAction('setSortBy', sortBy);
			},

			/**
			 * @param {any} postData
			 * @returns {void}
			 */
			create(postData: any): any {
				return this.sendAction('create', postData);
			},
		},

		/**
		 * @returns {void}
		 */
		didScroll(): void {
			if (this.get('hasMore') && !this.get('currentlyLoadingPage') && this.isScrolledToTrigger()) {
				this.setProperties({
					pageNum: this.pageNum + 1,
					currentlyLoadingPage: true,
				});
				this.sendAction('loadPage', this.pageNum);
			}
		},

		/**
		 * Check if scrolling should trigger fetching new posts
		 *
		 * @returns {boolean}
		 */
		isScrolledToTrigger(): boolean {
			var windowHeight = $(window).height(),
				triggerDistance = 0.25 * windowHeight,
				distanceToViewportTop = $(document).height() - windowHeight,
				viewPortTop = $(document).scrollTop();

			return distanceToViewportTop - viewPortTop < triggerDistance;
		},

		/**
		 * @returns {void}
		 */
		didInsertElement(): void {
			$(window).on('scroll', this.didScroll.bind(this));
		},

		/**
		 * @returns {void}
		 */
		willDestroyElement(): void {
			$(window).off('scroll', this.didScroll.bind(this));
		},
	}
);
