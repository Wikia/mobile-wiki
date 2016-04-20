import Ember from 'ember';
import Thumbnailer from 'common/modules/thumbnailer';
import ViewportMixin from '../mixins/viewport';
import {track as mercuryTrack, trackActions} from 'common/utils/track';

export default Ember.Component.extend(
	ViewportMixin,
	{
		imageAspectRatio: 16 / 9,
		thumbnailer: Thumbnailer,

		classNames: ['wikia-page-header'],

		isMainPage: false,
		mainPageName: Ember.get(Mercury, 'wiki.siteName'),
		mainPageTitle: Ember.get(Mercury, 'wiki.mainPageTitle'),


		computedStyle: Ember.computed('heroImage', 'viewportDimensions.width', function () {
			const heroImage = this.get('heroImage');

			if (Ember.isEmpty(heroImage)) {
				return null;
			}

			const windowWidth = this.get('viewportDimensions.width'),
				imageAspectRatio = this.get('imageAspectRatio'),
				imageWidth = heroImage.width || windowWidth,
				imageHeight = heroImage.height,
				maxWidth = Math.floor(imageHeight * imageAspectRatio);

			let computedHeight = imageHeight,
				cropMode = Thumbnailer.mode.thumbnailDown,
				thumbUrl;

			// wide image - crop images wider than 16:9 aspect ratio to 16:9
			if (imageWidth > maxWidth) {
				cropMode = Thumbnailer.mode.zoomCrop;
				computedHeight = Math.floor(windowWidth / imageAspectRatio);
			}

			// image needs resizing
			if (windowWidth < imageWidth) {
				computedHeight = Math.floor(windowWidth * (imageHeight / imageWidth));
			}

			// tall image - use top-crop-down for images taller than square
			if (windowWidth < computedHeight) {
				cropMode = Thumbnailer.mode.topCropDown;
				computedHeight = windowWidth;
			}

			// generate thumbnail
			thumbUrl = this.thumbnailer.getThumbURL(heroImage.url, {
				mode: cropMode,
				height: computedHeight,
				width: windowWidth
			});

			return new Ember.Handlebars.SafeString(`background-image: url(${thumbUrl}); height: ${computedHeight}px`);
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
