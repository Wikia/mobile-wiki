import Ember from 'ember';
import InfoboxBuilderEditItemMixin from '../mixins/infobox-builder-edit-item';

export default Ember.Component.extend(
	InfoboxBuilderEditItemMixin,
	{
		useArticleName: Ember.computed('item.data.defaultValue', {
			get() {
				return Boolean(this.get('item.data.defaultValue'));
			},
			set(key, value) {
				const item = this.get('item');

				this.trackEditItemOption('change', 'default-article-name');
				this.get('editTitleItem')(item, value);
				return value;
			}
		})
	}
);
