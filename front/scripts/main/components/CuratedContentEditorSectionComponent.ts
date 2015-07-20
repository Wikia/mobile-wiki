/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditorSectionComponent = Em.Component.extend({
	cropMode: Mercury.Modules.Thumbnailer.mode.topCrop,
	thumbnailer: Mercury.Modules.Thumbnailer,
	imageSize: 200,

	thumbUrl: Em.computed('model', function (): string {
		var model: CuratedContentEditorItemInterface = this.get('model'),
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
		editItem: function (item: CuratedContentEditorItemInterface): void {
			this.sendAction('editItem', item, this.get('model.title'));
		},

		addItem: function (): void {
			this.sendAction('addItem', this.get('model.title'));
		}
	}
});
