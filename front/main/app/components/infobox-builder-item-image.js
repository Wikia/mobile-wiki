import Ember from 'ember';
import InfoboxBuilderItemMixin from '../mixins/infobox-builder-item';
import SortableItem from 'ember-sortable/mixins/sortable-item';

export default Ember.Component.extend(
	SortableItem,
	InfoboxBuilderItemMixin,
	{
		tagName: 'figure',
		classNames: ['pi-item', 'pi-image'],
		// spacing around the element when dragged, used in SortableItem
		spacing: 8,
		thumbnail: '/front/common/images/infobox-builder-image-placeholder.png',
		// cannot be 'height' & 'width' because sortable-item uses height & width props for its own purposes
		imgWidth: 270,
		imgHeight: 152,
		caption: i18n.t('infobox-builder:main.caption-default')
	}
);

