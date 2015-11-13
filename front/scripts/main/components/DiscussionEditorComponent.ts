/// <reference path="../app.ts" />
'use strict';

App.DiscussionEditorComponent = Em.Component.extend(App.ViewportMixin, {
	attributeBindings: ['style'],
	classNames: ['discussion-editor', 'mobile-hidden'],
	classNameBindings: ['active', 'hasError'],

	active: false,
	sticky: false,

	submitDisabled: true,
	isLoading: false,
	showSuccess: false,
	hasError: false,

	/**
	 * Set right height for editor placeholder when editor gets sticky
	 * @returns {void}
	 */
	style: Em.computed('sticky', function (): Em.Handlebars.SafeString {
		return this.get('sticky') === true
			? new Em.Handlebars.SafeString(`height: ${this.$('.editor-container').outerHeight(true)}px`)
			: null;
	}),

	/**
	 * Initialize onScroll binding for sticky logic
	 * @returns {void}
	 */
	initilizeOnScroll(): void {
		var offsetTop = this.$().offset().top,
			siteHeadHeight = Em.$('.site-head').outerHeight(true),
			isAdded = false,
			getBreakpointHeight = () => {
				return offsetTop - (this.get('siteHeadPinned') ? siteHeadHeight : 0);
			};

		this.onScroll = () => {
			Em.run.throttle(
				this,
				function() {
					if (window.pageYOffset >= getBreakpointHeight() && !isAdded) {
						this.set('sticky', true);
						isAdded = true;
					} else if (window.pageYOffset < getBreakpointHeight() && isAdded) {
						this.set('sticky', false);
						isAdded = false;
					}
				},
				25
			);
		};

		Em.$(window).on('scroll', this.onScroll);
	},

	/**
	 * @returns {void}
	 */
	didInsertElement(): void {
		this._super();

		this.initilizeOnScroll();
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
		this.initilizeOnScroll();
	}),

	/**
	 * Perform animations and logic after post creation
	 * @returns {void}
	 */
	handleNewPostCreated: Em.observer('posts.@each._embedded.firstPost[0].isNew', function (): void {
		var newPosts = this.get('posts').filter(function(post: any) {
			return post._embedded.firstPost[0].isNew;
		});

		if (newPosts.length) {
			this.set('isLoading', false);
			this.set('showSuccess', true);

			newPosts.forEach(function(post: any) {
				Em.set(post._embedded.firstPost[0], 'isVisible', false);
			});

			Em.run.later(this, () => {
				this.set('showSuccess', false);
				this.set('active', false);
				this.set('submitDisabled', false);
				this.$('.editor-textarea').val('');

				newPosts.forEach(function(post: any) {
					Em.set(post._embedded.firstPost[0], 'isVisible', true);
				});

				Em.run.next(this, () => {
					newPosts.forEach(function(post: any) {
						Em.set(post._embedded.firstPost[0], 'isNew', false);
					});
				});
			}, 2000);
		}
	}),

	/**
	 * Handle post creation error
	 * @returns {void}
	 */
	errorObserver: Em.observer('shouldShowError', function () {
		if (this.get('shouldShowError')) {
			this.set('isLoading', false);
			this.set('hasError', true);
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
		toggleEditorActive(active: boolean) {
			this.set('active', active);
		},


		/**
		 * Send request to model to create new post and start animations
		 * @returns {void}
		 */
		createPost(forumId: string): void {
			this.set('isLoading', true);
			Em.$('html, body').animate({ scrollTop: 0 });

			this.sendAction('createPost', {
				body: this.$('.editor-textarea').val(),
				creatorId: this.get('currentUser.userId'),
				siteId: Mercury.wiki.id,
				threadId: forumId,
			});
		},

		/**
		 * Update editor when typing - activate editor and activate submit button
		 * @returns {void}
		 */
		updateOnType(): void {
			this.set('submitDisabled', this.$('.editor-textarea').val().length === 0);
			this.set('active', true);
		},

		/**
		 * Handle keypress - post creation shortcut
		 * @returns {void}
		 */
		handleKeyPress(forumId: string, event: KeyboardEvent) :void {
			if ((event.keyCode == 10 || event.keyCode == 13) && event.ctrlKey) {
				// Create post on CTR + ENTER
				this.send('createPost', forumId);
			}
		}
	}
});
