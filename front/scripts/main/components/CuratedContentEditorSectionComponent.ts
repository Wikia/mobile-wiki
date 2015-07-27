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
