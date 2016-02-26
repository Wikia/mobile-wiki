import Ember from 'ember';
import InfoboxBuilderItemMixin from '../mixins/infobox-builder-item';
import SortableItem from 'ember-sortable/mixins/sortable-item';

export default Ember.Component.extend(
	SortableItem,
	InfoboxBuilderItemMixin, {
		tagName: 'h2',
		classNames: ['pi-item', 'pi-item-spacing', 'pi-title'],

		value: Ember.computed('model.{infoboxBuilderData.index,data.defaultValue}', function () {
			const defaultValue = this.get('model.data.defaultValue');

			return defaultValue || i18n.t('infobox-builder:main.title-default', {
				ns: 'infobox-builder',
				index: this.get('model.infoboxBuilderData.index')
			});
		})
	}
);
