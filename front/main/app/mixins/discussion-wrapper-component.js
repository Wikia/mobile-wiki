import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Mixin.create(
	{
		classNames: ['forum-wrapper', 'discussion', 'forum'],
		isLoading: false,
		loadOnScrollEnabled: false,
		page: 1,
		postsDisplayed: 0,
		totalPosts: 0,

		autoScrollingOnObserver: Ember.observer('showLoadMoreButton', function () {
			if (!this.get('showLoadMoreButton') && this.get('loadOnScrollEnabled')) {
				track(trackActions.PostMore);
				this.scrollOn();
			}
		}),

		showToTheTopButton: Ember.computed('firstPageLoaded', function () {
			return !this.get('firstPageLoaded');
		}),

		showLoadMoreButton: Ember.computed.alias('hasMore'),
		/**
		 * @returns {void}
		 */
		willDestroyElement() {
			if (this.get('loadOnScrollEnabled')) {
				this.scrollOff();
			}
		},

		hasMore: Ember.computed('totalPosts', 'page', function () {
			return this.get('totalPosts') > this.getWithDefault('page', 1) * 20;
		}),

		loadingPageResolveObserver: Ember.observer('postsDisplayed', 'minorError', function () {
			this.set('isLoading', false);
		}),

		/**
		 * @returns {void}
		 */
		didScroll() {
			if (this.get('hasMore') && !this.get('isLoading') && this.isScrolledToTrigger()) {
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
			this.set('isLoading', true);
			this.incrementProperty('page');

			this.sendAction('loadPage', this.get('page'));
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

		actions: {
			loadNextPage() {
				if (!this.get('isLoading')) {
					track(trackActions.PostLoadMore);
					this.loadNextPage();
				}
			},
		},
	}
);
