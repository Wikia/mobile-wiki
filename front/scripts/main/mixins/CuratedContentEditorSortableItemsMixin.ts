/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditorSortableItemsMixin = Em.Mixin.create({
	sortableItems: Em.computed('model.items', function (): any {
		return Em.A().pushObjects(this.get('model.items'));
	}),

	actions: {
		moveBy(offset: number, item: CuratedContentEditorItemModel): void {
			var items: Em.NativeArray = this.get('sortableItems'),
				currentItemIndex = items.indexOf(item);

			if (offset > 0 && currentItemIndex > 0) {
				items.removeAt(currentItemIndex);
				items.insertAt(currentItemIndex - 1, item);
			} else if (offset < 0 && currentItemIndex < items.length - 1) {
				items.removeAt(currentItemIndex);
				items.insertAt(currentItemIndex + 1, item);
			}
		}
	}
});
