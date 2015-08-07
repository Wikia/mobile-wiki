/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditorLayoutMixin = Em.Mixin.create({
	itemFormLayout: {
		name: 'curated-content-editor-item-form'
	},
	imageSearchLayout: Em.computed('itemFormLayout', function() {
		return {
			name: 'curated-content-editor-image-search',
			previous: this.get('itemFormLayout'),
			next: this.get('imageCropLayout')
		}
	}),
	imageCropLayout: Em.computed('itemFormLayout', 'itemSearchLayout', function() {
		return {
			//@TODO use correct name
			name: 'curated-content-editor-image-crop',
			//@TODO should be set when entering this layout
			previous: this.get('itemFormLayout'),
			next: this.get('itemFormLayout')
		}
	})
});
