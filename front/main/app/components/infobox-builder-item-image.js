import Ember from 'ember';
import InfoboxBuilderItemMixin from '../mixins/infobox-builder-item';
import SortableItem from 'ember-sortable/mixins/sortable-item'

export default Ember.Component.extend(
	SortableItem,
	InfoboxBuilderItemMixin,
	{
		tagName: 'figure',
		classNames: ['pi-item', 'pi-image'],
		thumbnail: '/front/common/images/infobox-builder-image-placeholder.png',
		width: 270,
		height: 152,
		caption: i18n.t('infobox-builder:main.caption-default')
	}
);

