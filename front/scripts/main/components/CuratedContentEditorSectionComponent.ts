/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditorSectionComponent = Em.Component.extend({
	cropMode: Mercury.Modules.Thumbnailer.mode.topCrop,
	thumbnailer: Mercury.Modules.Thumbnailer,
	imageSize: 300,

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

	actions: {
		addItem(): void {
			this.sendAction('addItem');
		},

		editItem(item: typeof App.CuratedContentEditorItemModel): void {
			this.sendAction('editItem', item);
		},

		editSection: function (): void {
			this.sendAction('editSection', this.get('model'));
		},

		goBack(): void {
			this.sendAction('goBack');
		},

		updateSection(): void {
			this.sendAction('updateSection', this.get('model'));
		}
	}
});
