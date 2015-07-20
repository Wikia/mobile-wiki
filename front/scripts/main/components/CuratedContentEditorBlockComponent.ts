/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditorBlockComponent = Em.Component.extend({
	classNames: ['curated-content-editor-block'],
	tagName: 'section',

	actions: {
		addBlockItem: function (): void {
			this.sendAction('addBlockItem', this.get('block'));
		},

		editItem: function (item: CuratedContentEditorItemInterface): void {
			this.sendAction('editItem', item, this.get('block'));
		},

		openSection: function (item: CuratedContentEditorItemInterface): void {
			this.sendAction('openSection', item);
		}
	}
});
