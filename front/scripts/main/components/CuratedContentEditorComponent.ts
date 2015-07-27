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

		editBlockItem(item: CuratedContentEditorItemInterface, block: string): void {
			this.sendAction('editBlockItem', item, block);
		},

		editSectionItem(item: CuratedContentEditorItemInterface, section: string): void {
			this.sendAction('editSectionItem', item, section);
		},

		editSection(item: CuratedContentEditorItemInterface): void {
			this.sendAction('editSection', item);
		},

		addSection(): void {
			this.sendAction('addSection');
		},

		openSection(item: CuratedContentEditorItemInterface): void {
			this.sendAction('openSection', item);
		}
	}
});
