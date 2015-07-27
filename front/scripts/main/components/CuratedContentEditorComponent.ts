/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditorComponent = Em.Component.extend({
	classNames: ['curated-content-editor'],

	actions: {
		addBlockItem(block: string): void {
			this.sendAction('addBlockItem', block);
		},

		addSectionItem(section: string): void {
			this.sendAction('addSectionItem', section);
		},

		editBlockItem(item: CuratedContentEditorItemModel, block: string): void {
			this.sendAction('editBlockItem', item, block);
		},

		editSectionItem(item: CuratedContentEditorItemModel, section: string): void {
			this.sendAction('editSectionItem', item, section);
		},

		editSection(item: CuratedContentEditorItemModel): void {
			this.sendAction('editSection', item);
		},

		addSection(): void {
			this.sendAction('addSection');
		},

		openSection(item: CuratedContentEditorItemModel): void {
			this.sendAction('openSection', item);
		}
	}
});
