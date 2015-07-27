/// <reference path="../app.ts" />
///<reference path="../mixins/CuratedContentEditorThumbnailMixin.ts"/>
'use strict';

App.CuratedContentEditorSectionComponent = Em.Component.extend(App.CuratedContentEditorThumbnailMixin, {
	imageSize: 300,

	thumbUrl: Em.computed('model', function (): string {
		return this.generateThumbUrl(this.get('model.image_url'));
	}),

	actions: {
		addItem(): void {
			this.sendAction('addItem');
		},

		editItem(item: CuratedContentEditorItemModel): void {
			this.sendAction('editItem', item);
		},

		editSection(): void {
			this.sendAction('editSection', this.get('model'));
		},

		goBack(): void {
			this.sendAction('goBack');
		},

		done(): void {
			this.sendAction('done', this.get('model'));
		}
	}
});
