/// <reference path="../app.ts" />
'use strict';

App.LinkedGalleryMediaComponent = App.GalleryMediaComponent.extend({
	tagName: 'div',
	classNames: ['article-gallery', 'linked-gallery'],
	layoutName: 'components/linked-gallery-media',

	limit: 4,
	// This is set the same as the limit property to prevent "empty" images
	// from showing before "View more" button is clicked
	incrementLimitValue: 4,

	canShowMore: function (): boolean {
		return this.get('media').length > this.limit;
	},

	handleMedia: function (target: HTMLElement): void {
	},

	actions: {
		showMore: function (): void {
			var previousLimit = this.get('limit');
			this.set('limit', this.get('media').length);
			this.loadImages(previousLimit, (previousLimit + this.get('media').length));
			this.$('button').remove();
		}
	}
});
