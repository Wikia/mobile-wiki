/// <reference path="../app.ts" />
///<reference path="CuratedContentEditBlockItemComponent.ts"/>
'use strict';

App.CuratedContentEditSectionComponent = Em.Component.extend({
	cropMode: Mercury.Modules.Thumbnailer.mode.topCrop,
	thumbnailer: Mercury.Modules.Thumbnailer,
	imageSize: 200,

	thumbUrl: Em.computed('model', function (): string {
		var model: CuratedContentEditItemInterface = this.get('model'),
			options: any = {
				width: this.get('imageSize'),
				height: this.get('imageSize'),
				mode: this.get('cropMode')
			},
			thumbUrl = '';

		if (!Em.isEmpty(model.image_url)) {
			thumbUrl = this.thumbnailer.getThumbURL(model.image_url, options);
		}

		return thumbUrl;
	}),

	actions: {
		editItem: function (item: CuratedContentEditItemInterface): void {
			this.sendAction('editBlockItem', {section: this.get('model').title, item: item});
		},
	}
});
