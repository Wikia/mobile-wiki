/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditorThumbnailMixin = Em.Mixin.create({
	cropMode: Mercury.Modules.Thumbnailer.mode.topCrop,
	thumbnailer: Mercury.Modules.Thumbnailer,
	emptyGif: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',

	generateThumbUrl(imageUrl: string): string {
		var options: any = {
			width: this.get('imageSize'),
			height: this.get('imageSize'),
			mode: this.get('cropMode')
		};

		return imageUrl ? this.thumbnailer.getThumbURL(imageUrl, options) : this.get('emptyGif');
	}
});
