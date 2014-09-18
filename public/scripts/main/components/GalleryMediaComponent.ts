/// <reference path="../app.ts" />
/// <reference path="./MediaComponent.ts" />
'use strict';

App.GalleryMediaComponent = App.MediaComponent.extend({
	classNames: ['article-gallery'],
	layoutName: 'components/gallery-media',

	thumbSize: 195,
	//limit how many images get rendered before user scrolls to a gallery
	limit: 2,

	setUp: function (): void {
		var mediaArray = Em.A(),
			emptyGif = this.get('imageUrl');

		this.get('media').forEach((media, index) => {
			media.galleryRef = index;
			media.thumbUrl = emptyGif;

			mediaArray.pushObject(Em.Object.create(media));
		});

		this.setProperties({
			media: mediaArray,
			limit: 0
		});
	},

	limitedMedia: function (): ArticleMedia[] {
		var limit = this.get('limit');

		if (limit > 0) {
			return this.get('media').slice(0, this.get('limit'))
		} else {
			return this.get('media');
		}

	}.property('media', 'limit'),

	loadImage: function (image: any, thumbSize: number = this.get('thumbSize')): void {
		var galleryRef = typeof image === 'number' ? image : image.getAttribute('data-gallery-ref'),
			image = this.get('media.' + galleryRef);

		image.set('thumbUrl', this.thumbUrl(image.get('url'), thumbSize, thumbSize));
		image.set('load', true);
	},

	/**
	 * load an image and run update function when it is loaded
	 */
	load: function(): void {
		var thisGallery = this.$(),
			galleryWidth = thisGallery.width(),
			images = thisGallery.find('img:not(.loaded)'),
			imageWidth = images.width(),
			thumbSize = this.get('thumbSize');

		this.setUp();
		this.loadImage(0);
		this.loadImage(1);

		thisGallery.on('scroll', () => {
			Em.run.debounce(this, () => {
				thisGallery.find('img:not(.loaded)').each((index: number, image: HTMLImageElement) => {
					if (image.offsetLeft < galleryWidth + thisGallery.scrollLeft()) {
						this.loadImage(image);
					}
				});
			}, 100);
		})
	}
});
