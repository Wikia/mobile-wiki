/// <reference path="../app.ts" />
/// <reference path="../mixins/AlertNotificationsMixin.ts" />
/// <reference path="../mixins/CuratedContentEditorThumbnailMixin.ts"/>
/// <reference path="../mixins/LoadingSpinnerMixin.ts" />
///<reference path="../mixins/CuratedContentEditorLayoutMixin.ts"/>
'use strict';

App.CuratedContentEditorImageCropComponent = Em.Component.extend(
	App.AlertNotificationsMixin,
	App.CuratedContentEditorThumbnailMixin,
	App.LoadingSpinnerMixin,
	App.CuratedContentEditorLayoutMixin,
	{
		actions: {
			goBack(): void {
				this.sendAction('changeLayout', this.get('imageCropLayout.previous.name'));
			},

			done(): void {
				this.setProperties({
				 'model.image_url': this.get('imageProperties.url'),
				 // article_id comes from MW because in MW files are like any other articles
				 // so there is no such thing as image_id from MW perspective.
				 'model.image_id': this.get('imageProperties.article_id'),
				 'imageErrorMessage': null
				 });
				this.sendAction('changeLayout', this.get('imageCropLayout.next.name'))
			}
		}
});
