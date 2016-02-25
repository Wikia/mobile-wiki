import Ember from 'ember';
import InfoboxBuilderItemMixin from '../mixins/infobox-builder-item';
import SortableItem from 'ember-sortable/mixins/sortable-item';

export default Ember.Component.extend(
	SortableItem,
	InfoboxBuilderItemMixin, {
		classNames: ['pi-item pi-data', 'pi-item-spacing', 'pi-border-color'],
		// spacing around the element when dragged, used in SortableItem
		spacing: 8,
		label: Ember.computed.readOnly('model.data.label'),
		value: i18n.t('infobox-builder:main.row-default')
	}
);
