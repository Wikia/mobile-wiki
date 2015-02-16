/// <reference path="../app.ts" />
/// <reference path="./MediaComponent.ts" />
/// <reference path="../mixins/ArticleContentMixin.ts" />
'use strict';

interface ArticleMedia extends Em.Object {
	galleryRef: number;
	thumbUrl: string;
	captionClass: string;
}

App.GalleryMediaComponent = App.MediaComponent.extend(App.ArticleContentMixin, {
	classNames: ['article-gallery'],
	layoutName: 'components/gallery-media',

	thumbSize: 195,
	//limit how many images get rendered before user scrolls to a gallery
	limit: 2,
	incrementLimitValue: 10,

	setUp: function (): void {
		var mediaArray = Em.A(),
			emptyGif = this.get('emptyGif');

		this.get('media').forEach((media: ArticleMedia, index: number) => {
			media.galleryRef = index;
			media.thumbUrl = emptyGif;
			media.captionClass = media.caption.length > 0 ? ' has-caption' : '';

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
			return this.get('media').slice(0, limit);
		}

		return this.get('media');
	}.property('media', 'limit'),

	loadImages: function (
		imageOrGalleryRef: any,
		limit: number = 2,
		thumbSize: number = this.get('thumbSize')
	): void {
		var galleryRef = typeof imageOrGalleryRef === 'number' ?
				imageOrGalleryRef :
				~~imageOrGalleryRef.getAttribute('data-gallery-ref'),
			image: ArticleMedia,
			limit = Math.min(galleryRef + limit, this.get('galleryLength') - 1);

		for (; galleryRef <= limit; galleryRef++) {
			image = this.get('media').get(galleryRef);

			image.setProperties({
				thumbUrl: this.getThumbURL(
					image.get('url'),
					Mercury.Modules.Thumbnailer.mode.zoomCrop,
					thumbSize,
					thumbSize),
				load: true
			});
		}
	},

	/**
	 * Loads media and certain amount of images depending on the gallery width and thumbSize sets also onscroll handler
	 */
	load: function (): void {
		var $this: JQuery = this.$(),
			galleryWidth: number = $this.width(),
			thumbSize: number = this.get('thumbSize'),
			maxImages: number = Math.ceil(galleryWidth / thumbSize);

		this.setUp();
		this.loadImages(0, maxImages);

		$this.on('scroll', () => {
			Em.run.debounce(this, 'onScroll', maxImages, 100);
		});
	},

	onScroll: function (maxImages: number): void {
		var $this = this.$(),
			imagesToLoad = $this.find('img:not(.loaded)'),
			galleryOffset = $this.scrollLeft() + $this.width();

		if (imagesToLoad.length) {
			imagesToLoad.each((index: number, image: HTMLImageElement): void => {
				if (image.offsetLeft < galleryOffset) {
					this.loadImages(image, maxImages);
				}
			});
		} else if (this.get('limit') < this.get('galleryLength')) {
			this.incrementProperty('limit', this.incrementLimitValue);
		} else {
			$this.off('scroll');
		}
	}
});
