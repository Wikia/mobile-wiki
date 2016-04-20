import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

export default Ember.Component.extend(
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

				track({
					action: trackActions.click,
					category: 'map',
					label: 'open'
				});

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
