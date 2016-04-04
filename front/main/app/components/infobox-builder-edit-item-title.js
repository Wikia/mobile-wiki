import Ember from 'ember';
import InfoboxBuilderEditItemMixin from '../mixins/infobox-builder-edit-item';
import InfoboxBuilderSidebarOptionsMixin from '../mixins/infobox-builder-sidebar-options';
import generateGuid from '../utils/generate-guid';

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

		/**
		 * liquid-fire requires all ids have to be unique in order to not
		 * have two the same id's in view at a time
		 */
		inputId: Ember.computed(() => {
			return generateGuid('useArticleName');
		})
	}
);
