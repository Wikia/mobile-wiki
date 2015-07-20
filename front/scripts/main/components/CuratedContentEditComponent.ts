/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditComponent = Em.Component.extend({
	classNames: ['curated-content-edit'],

	actions: {
		editItem: function (item: CuratedContentEditItemModelInterface): void {
			this.sendAction('editItem', item);
		},

		addBlockItem: function (block: string): void {
			this.sendAction('addBlockItem', block);
		},

		addSectionItem: function (section: string): void {
			this.sendAction('addSectionItem', section);
		},

		openSection: function (item: CuratedContentEditItemModelInterface): void {
			this.sendAction('openSection', item);
		}
	}
});
