import Ember from 'ember';
import InfoboxBuilderItemMixin from '../mixins/infobox-builder-item';

export default Ember.Component.extend(
	InfoboxBuilderItemMixin,
	{
		tagName: 'figure',
		classNames: ['pi-item', 'pi-image'],
		url: '',
		thumbnail: '/front/common/images/infobox-builder-image-placeholder.png',
		width: 270,
		height: 152,
		caption: i18n.t('infobox-builder:main.caption-default'),

		videoClasses: Ember.computed(function () {
			return this.get('isVideo') ? 'video video-thumbnail small' : '';
		})
	}
);

