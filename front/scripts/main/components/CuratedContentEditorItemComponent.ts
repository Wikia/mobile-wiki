/// <reference path="../app.ts" />
'use strict';
App.CuratedContentEditorItemComponent = Em.Component.extend({
	classNames: ['curated-content-editor-item'],
	emptyGif: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7',

	imageUrl: Em.computed('model', function (): string {
		var model: CuratedContentEditorItemInterface = this.get('model');

		return !Em.isEmpty(model.image_url) ? model.image_url : this.emptyGif;
	}),

	displayPageInput: Em.computed('block', function (): boolean {
			return this.get('block') !== 'regular';
		}
	),

	didInsertElement: function() {
		var model = this.get('model');

		this.checkPage(model.title);
		this.checkLabel(model.label);
	},

	checkPage: function(value: string): void {
		var $element = this.$().find('.floating-label[for="page"]');
		if (value && value.length) {
			$element.addClass('active');
		} else {
			$element.removeClass('active');
		}
	},

	checkLabel: function(value: string): void {
		var $element = this.$().find('.floating-label[for="label"]');
		if (value && value.length) {
			$element.addClass('active');
		} else {
			$element.removeClass('active');
		}
	},

	actions: {
		checkPage: function(value: string): void {
			this.checkPage(value);
		},
		checkLabel: function(value: string): void {
			this.checkLabel(value);
		},
		updateItem: function(): void {
			debugger;
			this.sendAction('updateItem', this.get('model'), this.get('block'));
		}
	}
});
