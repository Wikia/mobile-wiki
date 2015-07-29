/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditorSortableItemsMixin = Em.Mixin.create({
	sortableItems: Em.computed('model.items', function (): any {
		return Em.A().pushObjects(this.get('model.items'));
	}),

	actions: {
		moveUp(item: CuratedContentEditorItemModel): void {
			var items: Em.NativeArray = this.get('sortableItems'),
				currentItemIndex = items.indexOf(item);

			if (currentItemIndex > 0) {
				items.removeAt(currentItemIndex);
				items.insertAt(currentItemIndex - 1, item);
			}
		},

		moveDown(item: CuratedContentEditorItemModel): void {
			var items: Em.NativeArray = this.get('sortableItems'),
				currentItemIndex = items.indexOf(item);

			if (currentItemIndex < items.length - 1) {
				items.removeAt(currentItemIndex);
				items.insertAt(currentItemIndex + 1, item);
			}
		}
	}
});
