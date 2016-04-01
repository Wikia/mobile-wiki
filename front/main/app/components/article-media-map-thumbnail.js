import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';

export default Ember.Component.extend(
	TrackClickMixin,
	{
		classNames: ['article-media-map-thumbnail'],
		tagName: 'figure',

		/**
		 * @returns {void|boolean}
		 */
		click() {
			const url = this.get('url'),
				id = this.get('id'),
				title = this.get('title');

			if (url) {
				Ember.Logger.debug('Handling map with id:', id, 'and title:', title);

				this.trackClick('map', 'open');
				this.get('openLightbox')('map', {
					id,
					title,
					url
				});

				return false;
			}
		}
	}
);
