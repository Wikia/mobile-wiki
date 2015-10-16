/// <reference path="../app.ts" />
/// <reference path="TrackClickMixin.ts"/>

'use strict';

App.CuratedContentEditorSortableItemsMixin = Em.Mixin.create(
	App.TrackClickMixin,
	{
	persistentSort: false,
	sortableItems: Em.computed('model.items', function (): any {
		var items = this.get('model.items') || [];
		return Em.A().pushObjects(items);
	}),

	actions: {
		moveBy(offset: number, item: CuratedContentEditorItemModel): void {
			this.trackClick('curated-content-editor', 'item-move');
			var items: Em.NativeArray = this.get('sortableItems'),
				currentItemIndex = items.indexOf(item);

			// Don't move item with index 0 by negative offset and don't move last item by positive offset
			if ((currentItemIndex > 0 && offset < 0) || (currentItemIndex < items.length - 1 && offset > 0)) {
				items.removeAt(currentItemIndex);
				items.insertAt(currentItemIndex + offset, item);

				if (this.get('persistentSort')) {
					this.set('model.items', this.get('sortableItems').slice(0, items.length));
					App.CuratedContentEditorModel.isDirty = true;
				}
			}
		}
	}
});
