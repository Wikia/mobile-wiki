import Ember from 'ember';
import InfoboxBuilderEditItemMixin from '../mixins/infobox-builder-edit-item';
import TrackClickMixin from '../mixins/track-click';

export default Ember.Component.extend(
	InfoboxBuilderEditItemMixin,
	TrackClickMixin,
	{
		labelValue: Ember.computed('item.data.label', {
			get() {
				return this.get('item.data.label');
			},
			set(key, value) {
				const item = this.get('item');

				this.trackClick('infobox-builder', `edit-item-${item.type}-label`);
				this.get('editRowItem')(item, value);
				return value;
			}
		})
	}
);
