/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditorComponent = Em.Component.extend({
	classNames: ['curated-content-editor'],

	isHelpVisible: false,
	helpText: null,

	actions: {
		addSection(): void {
			this.sendAction('addSection');
		},

		addBlockItem(block: string): void {
			this.sendAction('addBlockItem', block);
		},

		editBlockItem(item: CuratedContentEditorItemModel, block: string): void {
			this.sendAction('editBlockItem', item, block);
		},

		showHelp(helpText: string): void {
			this.setProperties({
				isHelpVisible: true,
				helpText: helpText
			});
		},

		openSection(item: CuratedContentEditorItemModel): void {
			this.sendAction('openSection', item);
		}
	}
});
