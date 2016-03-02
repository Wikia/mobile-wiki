import Ember from 'ember';
import InfoboxBuilderEditItemMixin from '../mixins/infobox-builder-edit-item';
import TrackClickMixin from '../mixins/track-click';

export default Ember.Component.extend(
	InfoboxBuilderEditItemMixin,
	TrackClickMixin,
	{
		value: Ember.computed('item.data', {
			get() {
				return this.get('item.data');
			},
			set(key, value) {
				const item = this.get('item');

				this.trackClick('infobox-builder', `edit-item-${item.type}-value`);
				this.get('editSectionHeaderItem')(item, {data: value});
				return value;
			}
		}),

		isCollapsible: Ember.computed('item.collapsible', {
			get() {
				return this.get('item.collapsible');
			},
			set(key, value) {
				const item = this.get('item');

				this.trackClick('infobox-builder', `edit-item-${item.type}-collapsible`);
				this.get('editSectionHeaderItem')(item, {collapsible: value});
				return value;
			}
		})
	}
);
