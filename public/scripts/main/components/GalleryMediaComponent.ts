/// <reference path="../app.ts" />
/// <reference path="./MediaComponent.ts" />
'use strict';

interface ArticleMedia extends Em.Object {
	galleryRef: number;
	thumbUrl: string;
}

App.GalleryMediaComponent = App.MediaComponent.extend({
	classNames: ['article-gallery'],
	layoutName: 'components/gallery-media',

	imageThumbSize: 195,
	videoThumbSize: 330,
	//limit how many images get rendered before user scrolls to a gallery
	limit: 2,
	incrementLimitValue: 10,

	setUp: function (): void {
		var mediaArray = Em.A(),
			emptyGif = this.get('emptyGif');

		this.get('media').forEach((media: ArticleMedia, index: number) => {
			media.galleryRef = index;
			media.thumbUrl = emptyGif;

			mediaArray.pushObject(Em.Object.create(media));
		});

		this.setProperties({
			media: mediaArray,
			limit: this.incrementLimitValue,
			galleryLength: mediaArray.length
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

	loadImages: function (
		imageOrGalleryRef: any,
		limit: number = 2,
		thumbHeight: number = this.get('imageThumbSize'),
		videoThumbWidth: number = this.get('videoThumbSize')
	): void {
		var galleryRef = typeof imageOrGalleryRef === 'number' ?
				imageOrGalleryRef :
				~~imageOrGalleryRef.getAttribute('data-gallery-ref'),
			image: ArticleMedia,
			limit = Math.min(galleryRef + limit, this.get('galleryLength') - 1),
			thumbWidth: number;

		for(;galleryRef <= limit; galleryRef++) {
			image = this.get('media').get(galleryRef);
			thumbWidth = image.type === 'video' ? videoThumbWidth : thumbHeight;

			image.setProperties({
				thumbUrl: this.getThumbURL(image.get('url'), thumbHeight, thumbWidth, 'crop'),
				load: true
			});
		}
	},

	/**
	 * load an image and run update function when it is loaded
	 */
	load: function(): void {
		var thisGallery = this.$(),
			galleryWidth = thisGallery.width(),
			thumbSize = this.get('imageThumbSize'),
			maxImages = Math.ceil(galleryWidth / thumbSize);

		this.setUp();
		this.loadImages(0, maxImages);

		thisGallery.on('scroll', () => {
			Em.run.debounce(this, () => {
				var images = thisGallery.find('img:not(.loaded)'),
					galleryScroll = thisGallery.scrollLeft();

				if (images.length) {
					images.each((index: number, image: HTMLImageElement) => {
						if (image.offsetLeft < galleryWidth + galleryScroll) {
							this.loadImages(image, maxImages);
						}
					});
				} else {
					if (this.get('limit') < this.get('galleryLength')) {
						this.incrementProperty('limit', this.incrementLimitValue);
					} else {
						thisGallery.off('scroll');
					}
				}
			}, 100);
		})
	}
});
