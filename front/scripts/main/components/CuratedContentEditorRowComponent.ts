/// <reference path="../app.ts" />
///<reference path="../mixins/CuratedContentEditorThumbnailMixin.ts"/>
'use strict';

App.CuratedContentEditorRowComponent = Em.Component.extend(App.CuratedContentEditorThumbnailMixin, {
	classNames: ['curated-content-editor-row'],
	imageSize: 100,

	thumbUrl: Em.computed('model', function (): string {
		return this.generateThumbUrl(this.get('model.image_url'));
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
