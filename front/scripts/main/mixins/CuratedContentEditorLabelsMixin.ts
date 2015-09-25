/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditorLabelsMixin = Em.Mixin.create({
	itemsCountLabel: Em.computed('model.items.length', function (): string {
		return i18n.t('app.curated-content-editor-items-count', {count: this.get('model.items.length')})
	})
});
