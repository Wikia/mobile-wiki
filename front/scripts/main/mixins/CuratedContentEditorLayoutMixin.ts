/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditorLayoutMixin = Em.Mixin.create({
	itemFormLayout: {
		name: 'curated-content-editor-item-form'
	},
	imageSearchLayout: {
		name: 'curated-content-editor-image-search',
		next: 'curated-content-editor-item-form',
		previous: 'curated-content-editor-item-form'
	}
});
