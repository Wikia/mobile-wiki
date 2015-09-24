/// <reference path="../app.ts" />
/// <reference path="../mixins/CuratedContentThumbnailMixin.ts"/>
/// <reference path="../mixins/CuratedContentEditorLabelsMixin.ts" />
'use strict';

App.CuratedContentEditorRowComponent = Em.Component.extend(
	App.CuratedContentThumbnailMixin,
	App.CuratedContentEditorLabelsMixin,
{
	classNames: ['curated-content-editor-row'],
	imageWidth: 48,

	thumbUrl: Em.computed('model', function (): string {
		return this.generateThumbUrl(this.get('model.image_url'));
	}),

	actions: {
		edit(): void {
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
