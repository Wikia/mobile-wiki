/// <reference path="../app.ts" />
/// <reference path="../mixins/CuratedContentEditorThumbnailMixin.ts"/>
'use strict';

App.CuratedContentEditorRowComponent = Em.Component.extend(App.CuratedContentEditorThumbnailMixin, {
	classNames: ['curated-content-editor-row-container'],
	imageWidth: 100,
	imageHeight: 100,

	thumbUrl: Em.computed('model', function (): string {
		return this.generateThumbUrl(this.get('model.image_url'));
	}),

	actions: {
		itemClick(): void {
			var model: CuratedContentEditorItemModel = this.get('model');

			if (model.node_type === 'section') {
				this.sendAction('openSection', model);
			} else {
				this.sendAction('editItem', model);
			}
		},
		moveBy(offset: number): void {
			this.sendAction('moveBy', offset, this.get('model'));
		}
	}
});
