/// <reference path="../app.ts" />
/// <reference path="../mixins/LoadingSpinnerMixin.ts" />
'use strict';

App.ForumWrapperComponent = Em.Component.extend(App.LoadingSpinnerMixin, {
	classNames: ['forum-wrapper', 'discussion', 'forum'],

	postsDisplayed: 0,
	totalPosts: 0,
	pageNum: 0,
	currentlyLoadingPage: false,
	isLoading: true,

	actions: {
		goToPost: function (postId: number): void {
			this.sendAction('goToPost', postId);
		}
	},

	didScroll: function() {
		if (this.hasMore() && !this.get('currentlyLoadingPage') && this.isScrolledToTrigger()) {
			this.setProperties({
				pageNum: this.pageNum + 1,
				currentlyLoadingPage: true,
			});
			this.sendAction('loadPage', this.pageNum);
		}
	},

	hasMore: function() {
		return this.totalPosts > this.postsDisplayed;
	},

	pageLoaded: Ember.observer('postsDisplayed', function() {
		this.set('currentlyLoadingPage', false);
	}),

	// Check if scrolling should trigger fetching new posts
	isScrolledToTrigger: function() {
		var windowHeight = $(window).height(),
			triggerDistance = 0.25 * windowHeight,
			distanceToViewportTop = $(document).height() - windowHeight,
			viewPortTop = $(document).scrollTop();

		return distanceToViewportTop - viewPortTop < triggerDistance;
	},

	didInsertElement: function() {
		$(window).on('scroll', this.didScroll.bind(this));
	},

	willDestroyElement: function() {
		$(window).off('scroll', this.didScroll.bind(this));
	}
});
