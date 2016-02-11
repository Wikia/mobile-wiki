import Ember from 'ember';
import InfoboxBuilderItemMixin from '../mixins/infobox-builder-item';

export default Ember.Component.extend(
	InfoboxBuilderItemMixin, {
		tagName: 'h2',
		classNames:['pi-item', 'pi-item-spacing', 'pi-title'],
		value: Ember.computed('item.infoboxBuilderData.index', function() {
			return `${i18n.t('infobox-builder:main.title-default')} ${this.get('item.infoboxBuilderData.index')}`
		})
	}
);

