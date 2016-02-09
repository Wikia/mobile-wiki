import Ember from 'ember';
import InfoboxBuilderItemMixin from '../mixins/infobox-builder-item';

export default Ember.Component.extend(
	InfoboxBuilderItemMixin, {
		tagName: '',
		value: Ember.computed.oneWay('item.data.defaultValue')
	}
);

