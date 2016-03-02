import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';

export default Ember.Component.extend(
	TrackClickMixin,
	{
		classNames: ['infobox-builder-button'],
		label: Ember.computed('name', function () {
			return i18n.t(`infobox-builder:main.add-${this.get('name')}`);
		}),

		click() {
			const buttonName = this.get('name');

			this.trackClick('infobox-builder', `add-item-${buttonName}`);
			this.get('onButtonClick')(buttonName);
		}
	}
);
