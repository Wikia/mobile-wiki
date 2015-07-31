/// <reference path="../app.ts" />
///<reference path="../mixins/CuratedContentEditorThumbnailMixin.ts"/>
///<reference path="../mixins/CuratedContentEditorSortableItemsMixin.ts"/>
'use strict';

App.CuratedContentEditorSectionComponent = Em.Component.extend(
	App.CuratedContentEditorThumbnailMixin,
	App.CuratedContentEditorSortableItemsMixin,
{
	imageSize: 300,
	thumbUrl: Em.computed('model', function (): string {
		return this.generateThumbUrl(this.get('model.image_url'));
	}),
	notEmptyItems: Em.computed.notEmpty('model.items'),

	actions: {
		addItem(): void {
			this.sendAction('addItem');
		},

		editItem(item: CuratedContentEditorItemModel): void {
			this.sendAction('editItem', item);
		},

		editSection(): void {
			this.sendAction('editSection', this.get('model'));
		},

		goBack(): void {
			this.sendAction('goBack');
		},

		done(): void {
			var sortableItems: any;
			if (this.get('notEmptyItems')) {
				sortableItems = this.get('sortableItems');
				this.set('model.items', sortableItems.slice(0, sortableItems.length));
				this.sendAction('done', this.get('model'));
			}
		}
	}
});
