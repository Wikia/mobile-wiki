import Ember from 'ember';
import InfoboxBuilderItemMixin from '../mixins/infobox-builder-item';

export default Ember.Component.extend(
	InfoboxBuilderItemMixin, {
		label: Ember.computed.oneWay('item.data.label'),
		value: Ember.computed.oneWay('item.data.defaultValue')
	}
);
