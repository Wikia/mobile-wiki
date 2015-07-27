/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditorBlockComponent = Em.Component.extend({
	classNames: ['curated-content-editor-block'],
	tagName: 'section',

	actions: {
		addItem(): void {
			this.sendAction('addItem', this.get('block'));
		},

		editItem(item: typeof App.CuratedContentEditorItemModel): void {
			this.sendAction('editItem', item, this.get('block'));
		},

		openSection(item: typeof App.CuratedContentEditorItemModel): void {
			this.sendAction('openSection', item);
		}
	}
});
