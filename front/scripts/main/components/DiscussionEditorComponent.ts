/// <reference path="../app.ts" />
'use strict';

App.DiscussionEditorComponent = Em.Component.extend(App.ViewportMixin, {
	attributeBindings: ['style'],
	classNames: ['discussion-editor', 'mobile-hidden'],
	classNameBindings: ['active'],

	active: false,
	sticky: false,

	submitDisabled: true,
	isLoading: false,
	showSuccess: false,

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

	click(): void {
		this.$('.editor-textarea').focus();
	},

	actions: {
		toggleEditorActive(active: boolean) {
			this.set('active', active);
		},

		createPost(forumId: number): void {
			this.set('isLoading', true);

			Em.$.ajax(<JQueryAjaxSettings>{
				method: 'POST',
				url: M.getDiscussionServiceUrl(`/${Mercury.wiki.id}/forums/${forumId}/threads`),
				data: JSON.stringify({
					body: this.$('.editor-textarea').val(),
					creatorId: this.get('currentUser.userId'),
					siteId: Mercury.wiki.id,
					threadId: forumId,
				}),
				contentType: 'application/json',
				xhrFields: {
					withCredentials: true,
				},
				success: (data: any): void => {
					this.set('showSuccess', true);
					Em.run.later(() => {
						this.set('showSuccess', false);
						this.set('active', false);
						this.$('.editor-textarea').val('');
						// TODO load new post
					}, 2000);
				},
				error: (): void => {
					// TODO
					console.log('error');
				},
				complete: (): void => {
					this.set('isLoading', false);
					// TODO
					console.log('complete');
				}
			});
		},

		updateSubmitButton(): void {
			this.set('submitDisabled', this.$('.editor-textarea').val().length === 0);
		}
	}
});
