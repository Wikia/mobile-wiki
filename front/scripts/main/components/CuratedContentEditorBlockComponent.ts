/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditorBlockComponent = Em.Component.extend({
	classNames: ['curated-content-editor-block'],
	tagName: 'section',

	actions: {
		addItem: function (): void {
			this.sendAction('addItem', this.get('block'));
		},

		editItem: function (item: CuratedContentEditorItemInterface): void {
			this.sendAction('editItem', item, this.get('block'));
		},

		openSection: function (item: CuratedContentEditorItemInterface): void {
			this.sendAction('openSection', item);
		}
	}
});
