/// <reference path="../app.ts" />
/// <reference path="../mixins/CuratedContentEditorThumbnailMixin.ts"/>
'use strict';

App.CuratedContentEditorRowComponent = Em.Component.extend(
	App.CuratedContentEditorThumbnailMixin,
	App.TrackClickMixin,
	{
	classNames: ['curated-content-editor-row-container'],
	imageSize: 100,

	thumbUrl: Em.computed('model', function (): string {
		return this.generateThumbUrl(this.get('model.image_url'));
	}),

	actions: {
		itemClick(): void {
			this.trackClick('curated-content-editor', 'item-click');
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
