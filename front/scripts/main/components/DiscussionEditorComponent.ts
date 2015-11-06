/// <reference path="../app.ts" />
'use strict';

App.DiscussionEditorComponent = Em.Component.extend({
	classNames: ['editor-container', 'mobile-hidden'],
	classNameBindings: ['active', 'sticky'],

	active: false,
	sticky: false,

	submitDisabled: true,

	// TODO destroyElement

	didInsertElement(): void {
		this._super();

		var $window = $(window),
			menu = $('.editor-container'),
			menuPosition = menu.offset().top - $('.discussion-header').outerHeight(true),
			placeholder = $('<div>').addClass('editor-container-placeholder'),
			isAdded = false;

		$window.scroll(() => {
			if (window.pageYOffset >= menuPosition && !isAdded) {
				this.set('sticky', true);
				placeholder.width(menu.outerWidth(true)).height(menu.outerHeight(true));
				menu.before(placeholder);
				isAdded = true;
			} else if (window.pageYOffset < menuPosition && isAdded) {
				this.set('sticky', false);
				placeholder.remove();
				isAdded = false;
			}
		});
	},

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
					body: Em.$('.editor').val(),
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
