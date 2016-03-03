import Ember from 'ember';
import InfoboxBuilderEditItemMixin from '../mixins/infobox-builder-edit-item';

export default Ember.Component.extend(
	InfoboxBuilderEditItemMixin,
	{
		labelValue: Ember.computed('item.data.label', {
			get() {
				return this.get('item.data.label');
			},
			set(key, value) {
				const item = this.get('item');

				this.trackBuilderClick('label');
				this.get('editRowItem')(item, value);
				return value;
			}
		})
	}
);
