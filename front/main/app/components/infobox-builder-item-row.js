import Ember from 'ember';
import InfoboxBuilderItemMixin from '../mixins/infobox-builder-item';

export default Ember.Component.extend(
	InfoboxBuilderItemMixin, {
		classNames: ['pi-item pi-data', 'pi-item-spacing', 'pi-border-color'],
		label: Ember.computed.oneWay('item.data.label'),
		value: i18n.t('infobox-builder:main.row-default')
	}
);
