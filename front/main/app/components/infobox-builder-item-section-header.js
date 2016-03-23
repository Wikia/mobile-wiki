import Ember from 'ember';
import InfoboxBuilderItemMixin from '../mixins/infobox-builder-item';
import SortableItem from 'ember-sortable/mixins/sortable-item';

export default Ember.Component.extend(
	SortableItem,
	InfoboxBuilderItemMixin,
	{
		tagName: 'h3',
		classNames: ['pi-item', 'pi-header', 'pi-secondary-font', 'pi-item-spacing', 'pi-secondary-background'],
		classNameBindings: ['collapsible'],
		collapsible: Ember.computed.readOnly('model.collapsible'),
		header: Ember.computed.readOnly('model.data'),
		uniq: Ember.computed.readOnly('model.infoboxBuilderData.id'),
		flow: Ember.computed('position', function() {
			return this.$().position().top < 200 ? 'bottomLeft' : 'topLeft';
		})
	}
);
