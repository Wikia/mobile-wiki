import Ember from 'ember';
import InfoboxBuilderEditItemMixin from '../mixins/infobox-builder-edit-item';

export default Ember.Component.extend(
	InfoboxBuilderEditItemMixin,
	{
		value: Ember.computed('item.data', {
			get() {
				return this.get('item.data');
			},
			set(key, value) {
				this.get('editSectionHeaderItem')(this.get('item'), {data: value});
				return value;
			}
		}),
		isCollapsible: Ember.computed('item.collapsible', {
			get() {
				return this.get('item.collapsible');
			},
			set(key, value) {
				this.get('editSectionHeaderItem')(this.get('item'), {collapsible: value});
				return value;
			}
		})
	}
);
