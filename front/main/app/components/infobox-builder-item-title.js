import Ember from 'ember';
import InfoboxBuilderItemMixin from '../mixins/infobox-builder-item';

export default Ember.Component.extend(
	InfoboxBuilderItemMixin, {
		tagName: '',
		value: Ember.computed('item.infoboxBuilderData.index', function() {
			return `${i18n.t('infobox-builder:main.title-default')} ${this.get('item.infoboxBuilderData.index')}`
		})
	}
);

