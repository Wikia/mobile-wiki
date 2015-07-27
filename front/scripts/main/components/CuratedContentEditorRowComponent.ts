/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditorRowComponent = Em.Component.extend({
	classNames: ['curated-content-editor-row'],

	cropMode: Mercury.Modules.Thumbnailer.mode.topCrop,
	thumbnailer: Mercury.Modules.Thumbnailer,
	imageSize: 100,

	thumbUrl: Em.computed('model', function (): string {
		var model: typeof App.CuratedContentEditorItemModel = this.get('model'),
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

	click(): void {
		var model: typeof App.CuratedContentEditorItemModel = this.get('model');

		if (model.node_type === 'section') {
			this.sendAction('openSection', model);
		} else {
			this.sendAction('editItem', model);
		}
	}
});
