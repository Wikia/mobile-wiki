import Ember from 'ember';
import InfoboxBuilderItemMixin from '../mixins/infobox-builder-item';

export default Ember.Component.extend(
	InfoboxBuilderItemMixin,
	{
		tagName: '',
		url: '',
		thumbnail: 'http://images.fanpop.com/images/image_uploads/Kermit-the-Frog-the-muppets-121870_500_325.jpg',
		width: 270,
		height: 152,

		alt: Ember.computed.oneWay('item.data.alt.data.defaultValue'),
		caption: Ember.computed.oneWay('item.data.caption.data.defaultValue'),

		videoClasses: Ember.computed(function () {
			return this.get('isVideo') ? 'video video-thumbnail small' : ''
		})
	}
);

