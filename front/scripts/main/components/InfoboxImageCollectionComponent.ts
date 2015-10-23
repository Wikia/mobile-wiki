/// <reference path="../app.ts" />
/// <reference path="./MediaComponent.ts" />
'use strict';

App.InfoboxImageCollectionComponent = App.MediaComponent.extend(App.ViewportMixin, {
	classNames: ['pi-image-collection'],
	classNameBindings: ['visible'],
	layoutName: 'components/infobox-image-collection',
	limitHeight: true,
	imageAspectRatio: 16 / 9,
	activeRef: 0,

	collectionLength: Em.computed('media', function(): number {
		return this.get('media').length;
	}),

	hasNextImage: Em.computed('activeRef', 'collectionLength', function(): boolean {
		return this.get('activeRef') < (this.get('collectionLength') - 1);
	}),

	hasPreviousImage: Em.computed.gt('activeRef', 0),

	computedHeight(media: typeof App.ArticleMedia): number {
		var windowWidth: number = this.get('viewportDimensions.width'),
			imageAspectRatio: number = this.get('imageAspectRatio'),
			imageWidth: number = media.width || windowWidth,
			imageHeight: number = media.height,
			maxWidth: number = Math.floor(imageHeight * imageAspectRatio),
			computedHeight: number = imageHeight;

		if (imageWidth > windowWidth) {
			computedHeight = Math.floor(windowWidth * (imageHeight / imageWidth));
		}

		//wide image- image wider than 16:9 aspect ratio
		//Crop it to have 16:9 ratio.
		if (imageWidth > maxWidth) {
			return Math.floor(windowWidth / imageAspectRatio);
		}

		//high image- image higher than square.
		if (windowWidth < computedHeight) {
			return windowWidth;
		}

		return computedHeight;
	},

	setup(): void {
		var mediaArray = Em.A(),
			emptyGif = this.get('emptyGif');

		this.get('media').forEach((image: ArticleMedia, index: number) => {
			image.galleryRef = index;
			image.thumbUrl = emptyGif;
			image.isActive = (index === this.get('activeRef'));

			mediaArray.pushObject(Em.Object.create(image));
		});

		this.set('media', mediaArray);
	},

	loadImages(): void {
		var image: ArticleMedia,
			width: number = this.get('viewportDimensions.width'),
			height: number,
			collectionLength = this.get('collectionLength');

		for (var galleryRef = 0; galleryRef < collectionLength ; galleryRef ++) {
			var cropMode = Mercury.Modules.Thumbnailer.mode.zoomCrop;
			image = this.get('media').get(galleryRef);
			height = this.computedHeight(image);

			if (image.height > image.width) {
				cropMode = Mercury.Modules.Thumbnailer.mode.topCropDown;
			}

			var thumbUrl = this.getThumbURL(image.url, {
				mode: cropMode,
				width: width,
				height: height
			});

			image.setProperties({
				thumbUrl: thumbUrl,
				load: true
			});
		}
	},

	load(): void {
		this.setup();
		this.loadImages();
		this.set('visible', true);
	},

	actions: {
		switchImage(direction: string) {
			var oldRef = this.get('activeRef'),
				refDirection = (direction === 'next') ? 1 : -1,
				newRef =  oldRef + refDirection,
				media = this.get('media'),
				oldImage = media.get(oldRef),
				newImage = media.get(newRef);

			oldImage.set('isActive', false);
			newImage.set('isActive', true);
			this.set('activeRef', newRef);
		}
	}
});
