/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditSectionComponent = Em.Component.extend({
	cropMode: Mercury.Modules.Thumbnailer.mode.topCrop,
	thumbnailer: Mercury.Modules.Thumbnailer,
	imageSize: 200,

	thumbUrl: Em.computed('model', function (): string {
		var model: CuratedContentEditItemModelInterface = this.get('model'),
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
		editItem: function (item: CuratedContentEditItemModelInterface): void {
			this.sendAction('editItem', {section: this.get('model').title, item: item});
		},

		addItem: function (): void {
			this.sendAction('addSectionItem', this.get('model').title);
		}
	}
});
