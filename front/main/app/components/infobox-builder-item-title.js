import Ember from 'ember';
import InfoboxBuilderItemMixin from '../mixins/infobox-builder-item';
import SortableItem from 'ember-sortable/mixins/sortable-item';

export default Ember.Component.extend(
	SortableItem,
	InfoboxBuilderItemMixin, {
		tagName: 'h2',
		classNames: ['pi-item', 'pi-item-spacing', 'pi-title'],

		value: Ember.computed('model.data.defaultValue', function () {
			return this.get('model.data.defaultValue') ?
				i18n.t('main.title-article-name', {
					ns: 'infobox-builder'
				}) :
				i18n.t('main.first-title-default', {
					ns: 'infobox-builder'
				});
		})
	}
);
