/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditRowComponent = Em.Component.extend({
	classNames: ['curated-content-edit-row'],

	cropMode: Mercury.Modules.Thumbnailer.mode.topCrop,
	thumbnailer: Mercury.Modules.Thumbnailer,
	imageSize: 100,

	/**
	 * Sections have titles, section items have labels and titles - we want to show labels for them
	 */
	title: Em.computed('model', function (): string {
		var model: CuratedContentEditItemInterface = this.get('model');

		return model.label || model.title;
	}),

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

	click: function (): void {
		var model: CuratedContentEditItemInterface = this.get('model');

		if (model.items) {
			this.sendAction('openSection', model);
		} else {
			this.sendAction('editItem', model);
		}
	}
});
