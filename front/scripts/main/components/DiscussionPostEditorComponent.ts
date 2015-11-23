/// <reference path="../app.ts" />
'use strict';

App.DiscussionPostEditorComponent = App.DiscussionEditorComponent.extend({
	attributeBindings: ['style'],
	classNames: ['discussion-editor', 'mobile-hidden'],
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
		var newPosts = this.get('posts').filter(function (post: any): boolean {
				return post._embedded.firstPost[0].isNew;
			}),
			newPost = newPosts.get('firstObject');

		if (newPost) {
			newPost = newPost._embedded.firstPost[0];

			this.setProperties({
				isLoading: false,
				showSuccess: true
			});

			Em.set(newPost, 'isVisible', false);

			Em.run.later(this, () => {
				this.showNewPostAnimations(newPost);
			}, 2000);
		}
	}),

	showNewPostAnimations(newPost: any): void {
		this.setProperties({
			isActive: false,
			postBody: '',
			showSuccess: false,
			submitDisabled: false
		});

		Em.set(newPost, 'isVisible', true);

		Ember.run.scheduleOnce('afterRender', this, () => {
			// This needs to be dalayed for CSS animation
			Em.set(newPost, 'isNew', false);
		});
	},

	/**
	 * Handle message for anon when activating editor
	 */
	isActiveObserver: Em.observer('isActive', function(): void {
		if (this.get('isActive')) {
			if (this.get('currentUser.userId') === null) {
				this.setProperties({
					isActive: false,
					errorMessage: 'editor.post-error-anon-cant-post'
				});
			}

			/*
			 iOS hack for position: fixed - now we display loading icon.
			 */
			if (/iPad|iPhone|iPod/.test(navigator.platform)) {
				$('html, body').css({
					height: '100%',
					overflow: 'hidden'
				});
			}
		} else {
			$('html, body').css({
				height: '',
				overflow: ''
			});
		}
	}),

	/**
	 * Handle clicks - focus in textarea and activate editor
	 * @returns {void}
	 */
	click(): void {
		this.$('.editor-textarea').focus();
	},

	actions: {
		/**
		 * Send request to model to create new post and start animations
		 * @returns {void}
		 */
		create(): void {
			this.set('isLoading', true);
			Em.$('html, body').animate({ scrollTop: 0 });

			this.sendAction('createPost', {
				body: this.$('.editor-textarea').val(),
				creatorId: this.get('currentUser.userId'),
				siteId: Mercury.wiki.id,
			});
		}
	}
});
