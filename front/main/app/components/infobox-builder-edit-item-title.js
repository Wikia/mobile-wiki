import Ember from 'ember';
import InfoboxBuilderEditItemMixin from '../mixins/infobox-builder-edit-item';
import InfoboxBuilderSidebarOptionsMixin from '../mixins/infobox-builder-sidebar-options';

export default Ember.Component.extend(
	InfoboxBuilderSidebarOptionsMixin,
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
		}),

		inputId: Ember.computed(function () {
			return this.createInputId('useArticleName');
		})
	}
);
