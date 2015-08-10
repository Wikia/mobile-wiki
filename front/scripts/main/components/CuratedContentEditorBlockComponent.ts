/// <reference path="../app.ts" />
///<reference path="../mixins/CuratedContentEditorSortableItemsMixin.ts"/>
'use strict';

App.CuratedContentEditorBlockComponent = Em.Component.extend(
	App.CuratedContentEditorSortableItemsMixin,
	App.TrackClickMixin,
	{
	tagName: 'section',
	classNames: ['curated-content-editor-block'],

	isHelpVisible: false,
	persistentSort: true,

	actions: {
		addItem(): void {
			this.sendAction('addItem', this.get('block'));
		},

		editItem(item: CuratedContentEditorItemModel): void {
			this.sendAction('editItem', item, this.get('block'));
		},

		openSection(item: CuratedContentEditorItemModel): void {
			this.sendAction('openSection', item);
		},

		showHelp(): void {
			this.trackClick('curated-content-editor', 'help-show');
			this.set('isHelpVisible', true);
		}
	}
});
