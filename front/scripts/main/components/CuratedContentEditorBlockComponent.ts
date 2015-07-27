/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditorBlockComponent = Em.Component.extend({
	classNames: ['curated-content-editor-block'],
	tagName: 'section',

	actions: {
		addItem(): void {
			this.sendAction('addItem', this.get('block'));
		},

		editItem(item: CuratedContentEditorItemModel): void {
			this.sendAction('editItem', item, this.get('block'));
		},

		openSection(item: CuratedContentEditorItemModel): void {
			this.sendAction('openSection', item);
		}
	}
});
