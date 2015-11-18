/// <reference path="../app.ts" />
'use strict';

App.DiscussionEditorComponent = Em.Component.extend(App.ViewportMixin, {
	attributeBindings: ['style'],
	classNames: ['discussion-editor', 'mobile-hidden'],
	classNameBindings: ['isActive', 'hasError'],

	isActive: false,
	isSticky: false,

	submitDisabled: true,
	isLoading: false,
	showSuccess: false,
	hasError: false,

	offsetTop: 0,
	siteHeadHeight: 0,

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
	}),

	getBreakpointHeight(): number {
		return this.offsetTop - (this.get('siteHeadPinned') ? this.siteHeadHeight : 0);
	},

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
				this.setProperties({
					showSuccess: false,
					isActive: false,
					submitDisabled: false
				});

				this.$('.editor-textarea').val('');

				Em.set(newPost, 'isVisible', true);

				Em.run.next(this, () => {
					// This needs to be dalayed for CSS animation
					Em.set(newPost, 'isNew', false);
				});
			}, 2000);
		}
	}),

	/**
	 * Handle post creation error
	 * @returns {void}
	 */
	errorObserver: Em.observer('shouldShowError', function (): void {
		if (this.get('shouldShowError')) {
			this.setProperties({
				isLoading: false,
				hasError: true
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
		 * Enable/disable editor
		 * @returns {void}
		 */
		toggleEditorActive(active: boolean): void {
			this.set('isActive', active);
		},

		/**
		 * Send request to model to create new post and start animations
		 * @returns {void}
		 */
		createPost(): void {
			this.set('isLoading', true);
			Em.$('html, body').animate({ scrollTop: 0 });

			this.sendAction('createPost', {
				body: this.$('.editor-textarea').val(),
				creatorId: this.get('currentUser.userId'),
				siteId: Mercury.wiki.id,
			});
		},

		/**
		 * Update editor when typing - activate editor and activate submit button
		 * @returns {void}
		 */
		updateOnInput(): void {
			this.setProperties({
				submitDisabled: this.$('.editor-textarea').val().length === 0,
				isActive: true
			});
		},

		/**
		 * Handle keypress - post creation shortcut
		 * @returns {void}
		 */
		handleKeyPress(event: KeyboardEvent) :void {
			if ((event.keyCode == 10 || event.keyCode == 13) && event.ctrlKey) {
				// Create post on CTRL + ENTER
				this.send('createPost');
			}
		}
	}
});
