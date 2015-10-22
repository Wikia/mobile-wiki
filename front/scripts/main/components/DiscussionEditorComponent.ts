/// <reference path="../app.ts" />
'use strict';

App.DiscussionEditorComponent = Em.Component.extend({
	classNames: ['editor-container', 'mobile-hidden'],
	classNameBindings: ['active'],

	active: false,

	didInsertElement(): void {
		this._super();

		var $window = $(window),
			menu = $('.editor-container'),
			menuPosition = menu.offset().top - $('.discussion-header').outerHeight(true),
			placeholder = $('<div>').addClass('editor-container-placeholder'),
			isAdded = false;

		$window.scroll(() => {
			if (window.pageYOffset >= menuPosition && !isAdded) {
				menu.addClass('sticky');
				placeholder.width(menu.outerWidth(true)).height(menu.outerHeight(true));
				menu.before(placeholder);
				isAdded = true;
			} else if (window.pageYOffset < menuPosition && isAdded) {
				menu.removeClass('sticky');
				placeholder.remove();
				isAdded = false;
			}
		});
	},

	actions: {
		activateEditorComponent(): void {
			this.set('active', true);
		},
		deactivateEditorComponent(): void {
			this.set('active', true);
		},
	}
});
