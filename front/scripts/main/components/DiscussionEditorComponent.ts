/// <reference path="../app.ts" />
'use strict';

App.DiscussionEditorComponent = Em.Component.extend(App.ViewportMixin, {
	attributeBindings: ['style'],
	classNames: ['discussion-editor', 'mobile-hidden'],
	classNameBindings: ['active'],

	active: false,
	sticky: false,

	submitDisabled: true,

	style: Em.computed('sticky', function (): Em.Handlebars.SafeString {
		return this.get('sticky') === true
			? new Em.Handlebars.SafeString(`height: ${this.$('.editor-container').outerHeight(true)}px`)
			: null;
	}),

	initilizeOnScroll(): void {
		var menuPosition = this.$().offset().top - Em.$('.site-head').outerHeight(true),
			isAdded = false;

		this.onScroll = () => {
			Em.run.throttle(
				this,
				function() {
					if (window.pageYOffset >= menuPosition && !isAdded) {
						this.set('sticky', true);
						isAdded = true;
					} else if (window.pageYOffset < menuPosition && isAdded) {
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
		Em.$('.editor').focus();
	},

	actions: {
		activateEditorComponent(): void {
			this.set('active', true);
		},

		deactivateEditorComponent(): void {
			this.set('active', false);
		},

		createPost(forumId): void {
			Em.$.ajax(<JQueryAjaxSettings>{
				method: 'POST',
				url: M.getDiscussionServiceUrl(`/${Mercury.wiki.id}/forums/${forumId}/threads`),
				data: JSON.stringify({
					body: this.$('.editor').val(),
					creatorId: this.get('currentUser.userId'),
					siteId: Mercury.wiki.id,
					threadId: forumId,
				}),
				contentType: 'application/json',
				xhrFields: {
					withCredentials: true,
				},
				success: (data: any): void => {
					// TODO
					console.log('success');
				},
				error: (): void => {
					// TODO
					console.log('error');
				},
				complete: (): void => {
					// TODO
					console.log('complete');
				}
			});
		},

		updateSubmitButton(): void {
			this.set('submitDisabled', Em.$('.editor').val().length === 0);
		}
	}
});
