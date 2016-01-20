import Ember from 'ember';
import TrackClickMixin from './track-click';
import CuratedContentEditorModel from '../models/curated-content-editor';

export default Ember.Mixin.create(
	TrackClickMixin,
	{
		persistentSort: false,
		sortableItems: Ember.computed('model.items', function () {
			const items = this.get('model.items') || [];

			return Ember.A().pushObjects(items);
		}),

		actions: {
			/**
			 * @param {number} offset
			 * @param {CuratedContentEditorItemModel} item
			 * @returns {void}
			 */
			moveBy(offset, item) {
				const items = this.get('sortableItems'),
					currentItemIndex = items.indexOf(item);

				this.trackClick('curated-content-editor', 'item-move');

				// Don't move item with index 0 by negative offset and don't move last item by positive offset
				if ((currentItemIndex > 0 && offset < 0) || (currentItemIndex < items.length - 1 && offset > 0)) {
					items.removeAt(currentItemIndex);
					items.insertAt(currentItemIndex + offset, item);

					if (this.get('persistentSort')) {
						this.set('model.items', this.get('sortableItems').slice(0, items.length));
						CuratedContentEditorModel.isDirty = true;
					}
				}
			}
		}
	});
