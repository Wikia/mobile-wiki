/// <reference path="../app.ts" />
/// <reference path="./GalleryMediaComponent.ts" />
'use strict';

App.LinkedGalleryMediaComponent = App.GalleryMediaComponent.extend({
	tagName: 'div',
	classNames: ['linked-gallery'],
	layoutName: 'components/linked-gallery-media',

	limit: 4,
	// This is set the same as the limit property to prevent "empty" images
	// from showing before "View more" button is clicked
	incrementLimitValue: 4,

	canShowMore: function (): boolean {
		return this.get('media').length > this.get('limit');
	}.property('media', 'limit'),

	actions: {
		showMore: function (): void {
			var previousLimit = this.get('limit'),
				mediaLength = this.get('media').length;
			this.set('limit', mediaLength);
			this.loadImages(previousLimit, (previousLimit + mediaLength));
			this.$('button').remove();
		}
	}
});
