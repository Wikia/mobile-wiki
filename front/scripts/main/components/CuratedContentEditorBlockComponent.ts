/// <reference path="../app.ts" />
///<reference path="../mixins/CuratedContentEditorSortableItemsMixin.ts"/>
'use strict';

App.CuratedContentEditorBlockComponent = Em.Component.extend(App.CuratedContentEditorSortableItemsMixin, {
	classNames: ['curated-content-editor-block'],
	tagName: 'section',
	persistentSort: true,

	actions: {
		addItem(): void {
			this.sendAction('addItem', this.get('block'));
		},

		editItem(item: CuratedContentEditorItemModel): void {
			this.sendAction('editItem', item, this.get('block'));
		},

		showHelp(): void {
			this.sendAction('showHelp', i18n.t(this.get('helpText')));
		},

		openSection(item: CuratedContentEditorItemModel): void {
			this.sendAction('openSection', item);
		}
	}
});
