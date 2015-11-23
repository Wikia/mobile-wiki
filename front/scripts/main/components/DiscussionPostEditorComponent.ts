/// <reference path="../app.ts" />
'use strict';

App.DiscussionPostEditorComponent = App.DiscussionEditorComponent.extend({
	attributeBindings: ['style'],
	classNames: ['mobile-hidden'],
	pinnedClassName: 'pinned-top',

	placeholderText: 'editor.post-editor-placeholder-text',
	submitText: 'editor.post-action-button-label',
	labelText: 'editor.post-editor-label',

	/**
	 * Set right height for editor placeholder when editor gets sticky
	 * @returns {void}
	 */
	style: Em.computed('isSticky', function (): string {
		return this.get('isSticky') === true
			? `height: ${this.$('.editor-container').outerHeight(true)}px`
			: null;
	}),

	/**
	 * Initialize onScroll binding for sticky logic
	 * @returns {void}
	 */
	initializeOnScroll: Em.on('didInsertElement', function (): void {
		this.offsetTop = this.$().offset().top;
		this.siteHeadHeight = Em.$('.site-head').outerHeight(true);

		Em.$(window).on('scroll', (): void => {
			this.onScroll();
		});

		if (/iPad|iPhone|iPod/.test(navigator.platform)) {
			/*
			 Ultra hack for editor on iOS
			 iOS is scrolling on textarea focus, changing it's size on focus prevent that
			 */
			var $editorTextarea = $('.editor-textarea');
			$editorTextarea
				.css('height', '100px')
				.on('focus', function() {
					setTimeout(function(){
						$editorTextarea.css('height', '100%');
					}, 500);
				})
				.on('blur', function() {
					$editorTextarea.css('height', '100px');
				});
		}

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
	didInsertElement(): void {
		this._super();

		this.initializeOnScroll();
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
		this.initializeOnScroll();
	}),

	/**
	 * Perform animations and logic after post creation
	 * @returns {void}
	 */
	handleNewPostCreated: Em.observer('posts.@each._embedded.firstPost[0].isNew', function (): void {
		Em.$('html, body').animate({ scrollTop: 0 });
		var newPosts = this.get('posts').filter(function (post: any): boolean {
				return post._embedded.firstPost[0].isNew;
			}),
			newPost = newPosts.get('firstObject');

		this.handleNewItemCreated(newPost);
	}),

	actions: {
		/**
		 * Send request to model to create new post and start animations
		 * @returns {void}
		 */
		create(): void {
			this.set('isLoading', true);

			this.sendAction('createPost', {
				body: this.get('bodyText'),
				creatorId: this.get('currentUser.userId'),
				siteId: Mercury.wiki.id,
			});
		}
	}
});
