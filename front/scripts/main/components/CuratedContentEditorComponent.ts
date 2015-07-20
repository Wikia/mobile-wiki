/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditorComponent = Em.Component.extend({
	classNames: ['curated-content-editor'],

	actions: {
		addBlockItem: function (block: string): void {
			this.sendAction('addBlockItem', block);
		},

		addSectionItem: function (section: string): void {
			this.sendAction('addSectionItem', section);
		},

		editBlockItem: function (item: CuratedContentEditorItemInterface, block: string): void {
			this.sendAction('editBlockItem', item, block);
		},

		editSectionItem: function (item: CuratedContentEditorItemInterface, section: string): void {
			this.sendAction('editSectionItem', item, section);
		},

		openSection: function (item: CuratedContentEditorItemInterface): void {
			this.sendAction('openSection', item);
		}
	}
});
