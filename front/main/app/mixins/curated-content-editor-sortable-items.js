import Ember from 'ember';
import CuratedContentEditorModel from '../models/curated-content-editor';
import {track, trackActions} from 'common/utils/track';

export default Ember.Mixin.create(
	{
		persistentSort: false,
		sortableItems: Ember.computed.reads('model.items'),

		actions: {
			/**
			 * @param {number} offset
			 * @param {CuratedContentEditorItemModel} item
			 * @returns {void}
			 */
			moveBy(offset, item) {
				const items = this.get('sortableItems'),
					currentItemIndex = items.indexOf(item);

				track({
					action: trackActions.click,
					category: 'curated-content-editor',
					label: 'item-move'
				});

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
