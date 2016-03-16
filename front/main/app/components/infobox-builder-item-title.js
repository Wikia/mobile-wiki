import Ember from 'ember';
import InfoboxBuilderItemMixin from '../mixins/infobox-builder-item';
import SortableItem from 'ember-sortable/mixins/sortable-item';

export default Ember.Component.extend(
	SortableItem,
	InfoboxBuilderItemMixin, {
		tagName: 'h2',
		classNames: ['pi-item', 'pi-item-spacing', 'pi-title'],

		value: Ember.computed('model.{infoboxBuilderData.index,data.defaultValue}', function () {
			const index = this.get('model.infoboxBuilderData.index'),
				articleTitle = i18n.t('infobox-builder:main.title-article-name', {
					ns: 'infobox-builder'
				}),
				defaultTitle = index === 1 ?
					i18n.t('infobox-builder:main.first-title-default', {
						ns: 'infobox-builder'
					}) :
					i18n.t('infobox-builder:main.title-default', {
						ns: 'infobox-builder',
						index
					});

			return this.get('model.data.defaultValue') ? articleTitle : defaultTitle;
		})
	}
);
