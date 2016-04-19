import Ember from 'ember';
import Thumbnailer from 'common/modules/thumbnailer';
import {track as mercuryTrack, trackActions} from 'common/utils/track';

export default Ember.Component.extend(
	{
		classNames: ['wikia-page-header'],

		isMainPage: false,
		mainPageName: Ember.get(Mercury, 'wiki.siteName'),
		mainPageTitle: Ember.get(Mercury, 'wiki.mainPageTitle'),


		computedStyle: Ember.computed('heroImage', function () {
			const heroImage = this.get('heroImage');

			if (Ember.isEmpty(heroImage)) {
				return null;
			}

			return new Ember.Handlebars.SafeString('background-image: url(' + heroImage.url + ')');
		}),

		actions: {
			trackClick() {
				mercuryTrack({
					action: trackActions.click,
					category: 'wikiname'
				});
			}
		}
	}
);
