/// <reference path="../app.ts" />
/// <reference path="./MediaComponent.ts" />
'use strict';

App.GalleryMediaComponent = App.MediaComponent.extend({
	classNames: ['article-gallery'],
	layoutName: 'components/gallery-media',

	urls: function (): any {
		var urls = [];

		this.get('media').forEach((media) => {
			//urls.push(this.thumbUrl(media.url, 195, 195));
			urls.push(this.get('imageUrl'));
		});

		return urls;
	}.property('isGallery', 'media'),

	/**
	 * load an image and run update function when it is loaded
	 */
	load: function(): void {
		this.$().on('scroll', function () {
			console.log(this)
		})
	}
});
