/// <reference path="../app.ts" />
'use strict';

App.DiscussionPostEditorComponent = App.DiscussionEditorComponent.extend({
	classNames: ['mobile-hidden'],
	pinnedClassName: 'pinned-top',

	placeholderText: 'editor.post-editor-placeholder-text',
	submitText: 'editor.post-action-button-label',
	labelText: 'editor.post-editor-label',

	/**
	 * Initialize onScroll binding for sticky logic
	 * @returns {void}
	 */
	initializeStickyState: Em.on('didInsertElement', function (): void {
		this.setProperties({
			offsetTop: this.$().offset().top,
			siteHeadHeight: Em.$('.site-head').outerHeight(true)
		});

		Em.$(window).on('scroll', (): void => {
			this.onScroll();
		});
	}),

	onScroll(): void {
		Em.run.throttle(
			this,
			function (): void {
				if (window.pageYOffset >= this.getBreakpointHeight() && !this.get('isSticky')) {
					this.set('isSticky', true);
				} else if (window.pageYOffset < this.getBreakpointHeight() && this.get('isSticky')) {
					this.set('isSticky', false);
				}
			},
			25
		);
	},

	/**
	 * @returns {void}
	 */
	willDestroyElement(): void {
		Em.$(window).off('scroll', this.onScroll);
	},

	/**
	 * Handle recalculation of placeholder size on resize
	 * @returns {void}
	 */
	viewportChangeObserver: Em.observer('viewportDimensions.width', function (): void {
		Em.$(window).off('scroll', this.onScroll);
		this.initializeStickyState();
	}),

	/**
	 * Perform animations and logic after post creation
	 * @returns {void}
	 */
	handleNewPostCreated: Em.observer('posts.@each._embedded.firstPost[0].isNew', function (): void {
		var newPosts = this.get('posts').filter(function (post: any): boolean {
				return post._embedded.firstPost[0].isNew;
			}),
			newPost = newPosts.get('firstObject');

		if (newPost) {
			Em.$('html, body').animate({scrollTop: 0});
			newPost = newPost._embedded.firstPost[0];
			this.handleNewItemCreated(newPost);
		}
	})
});
