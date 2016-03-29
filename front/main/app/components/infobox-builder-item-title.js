import Ember from 'ember';
import InfoboxBuilderItemMixin from '../mixins/infobox-builder-item';
import SortableItem from 'ember-sortable/mixins/sortable-item';

export default Ember.Component.extend(
	SortableItem,
	InfoboxBuilderItemMixin, {
		tagName: 'h2',
		classNames: ['pi-item', 'pi-item-spacing', 'pi-title']
	}
);
