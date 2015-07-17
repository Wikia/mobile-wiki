/// <reference path="../app.ts" />
'use strict';
App.CuratedContentEditItemComponent = Em.Component.extend({
	classNames: ['curated-content-edit-item'],
	emptyGif: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7',

	imageUrl: Em.computed('model.item', function (): string {
		var item: CuratedContentEditItemInterface = this.get('model.item');

		return !Em.isEmpty(item.image_url) ? item.image_url : this.emptyGif;
	}),

	willInsertElement: function() {
		this.set('item', this.get('model').item);
		this.set('block', this.get('model').block);
	},

	didInsertElement: function() {
		this.checkPage(this.get('item.title'));
		this.checkLabel(this.get('item.label'));
	},

	checkPage: function(value: string): void {
		var $element = this.$().find('.floating-label[for="label"]');
		console.log('label', value, $element);
		if (value.length) {
			$element.addClass('active');
		} else {
			$element.removeClass('active');
		}
	},

	checkLabel: function(value: string): void {
		var $element = this.$().find('.floating-label[for="page"]');
		console.log('page', value, $element);
		if (value.length) {
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
	}
});
