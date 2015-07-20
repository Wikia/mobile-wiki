/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditorComponent = Em.Component.extend({
	classNames: ['curated-content-editor'],

	actions: {
		editItem: function (item: CuratedContentEditorItemInterface): void {
			this.sendAction('editItem', item);
		},

		addBlockItem: function (block: string): void {
			this.sendAction('addBlockItem', block);
		},

		addSectionItem: function (section: string): void {
			this.sendAction('addSectionItem', section);
		},

		openSection: function (item: CuratedContentEditorItemInterface): void {
			this.sendAction('openSection', item);
		}
	}
});
