import Ember from 'ember';
import InfoboxBuilderItemMixin from '../mixins/infobox-builder-item';

export default Ember.Component.extend(
	InfoboxBuilderItemMixin,
	{
		tagName: 'h3',
		classNames: ['pi-item', 'pi-header', 'pi-secondary-font', 'pi-item-spacing', 'pi-secondary-background'],
		header: Ember.computed.readOnly('item.data')
	}
);
