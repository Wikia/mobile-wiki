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

	style: Em.computed('sticky', function (): Em.Handlebars.SafeString {
		return this.get('sticky') === true
			? new Em.Handlebars.SafeString(`height: ${this.$('.editor-container').outerHeight(true)}px`)
			: null;
	}),

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

	didInsertElement(): void {
		this._super();

		this.initilizeOnScroll();
	},

	willDestroyElement(): void {
		Em.$(window).off('scroll', this.onScroll);
	},

	viewportChangeObserver: Em.observer('viewportDimensions.width', function (): void {
		Em.$(window).off('scroll', this.onScroll);
		this.initilizeOnScroll();
	}),

	handleNewPostCreated: Em.observer('posts.@each._embedded.firstPost[0].isNew', function (): void {
		var newPosts = this.get('posts').filter(function(post) {
			return post._embedded.firstPost[0].isNew;
		});

		if (newPosts.length) {
			this.set('isLoading', false);
			this.set('showSuccess', true);

			newPosts.forEach(function(post) {
				Em.set(post._embedded.firstPost[0], 'isVisible', false);
			});

			Em.run.later(this, () => {
				this.set('showSuccess', false);
				this.set('active', false);
				this.set('submitDisabled', false);
				this.$('.editor-textarea').val('');

				newPosts.forEach(function(post) {
					Em.set(post._embedded.firstPost[0], 'isVisible', true);
				});

				Em.run.next(this, () => {
					newPosts.forEach(function(post) {
						Em.set(post._embedded.firstPost[0], 'isNew', false);
					});
				});
			}, 2000);
		}
	}),

	errorObserver: Em.observer('shouldShowError', function () {
		if (this.get('shouldShowError')) {
			this.set('isLoading', false);
			this.set('hasError', true);
		}
	}),

	click(): void {
		this.$('.editor-textarea').focus();
	},

	actions: {
		toggleEditorActive(active: boolean) {
			this.set('active', active);
		},

		createPost(forumId: string): void {
			this.set('isLoading', true);
			// TODO fix switching tabs
			Em.$('html, body').animate({ scrollTop: 0 });

			this.sendAction('createPost', {
				body: this.$('.editor-textarea').val(),
				creatorId: this.get('currentUser.userId'),
				siteId: Mercury.wiki.id,
				threadId: forumId,
			});
		},

		updateOnType(): void {
			this.set('submitDisabled', this.$('.editor-textarea').val().length === 0);
			this.set('active', true);
		}
	}
});
