/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditorLabelsMixin = Em.Mixin.create({
	isCategory: Em.computed('isFeaturedItem', 'isSection', function (): boolean {
		return !(this.get('isFeaturedItem') || this.get('isSection'));
	}),

	itemsCountLabel: Em.computed('model.items.length', function (): string {
		return i18n.t('app.curated-content-editor-items-count', {count: this.get('model.items.length')})
	}),

	headerLabel: Em.computed('model.label', 'isFeatured', 'isSection', function (): string {
		var modelLabel = this.get('model.label');
		if (modelLabel) {
			return modelLabel;
		} else {
			if (this.get('isFeaturedItem')) {
				return i18n.t('app.curated-content-editor-new-featured-content');
			} else if (this.get('isSection')) {
				return i18n.t('app.curated-content-editor-new-section');
			} else {
				return i18n.t('app.curated-content-editor-new-category');
			}
		}
	}),

	pageNameLabel: Em.computed('isCategory', function (): string {
		if (this.get('isCategory')) {
			return i18n.t('app.curated-content-editor-enter-category-name');
		} else {
			return i18n.t('app.curated-content-editor-enter-page-name');
		}
	})
});
