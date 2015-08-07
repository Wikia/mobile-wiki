/// <reference path="../app.ts" />
/// <reference path="../mixins/AlertNotificationsMixin.ts" />
/// <reference path="../mixins/CuratedContentEditorThumbnailMixin.ts"/>
/// <reference path="../mixins/LoadingSpinnerMixin.ts" />
///<reference path="../mixins/CuratedContentEditorLayoutMixin.ts"/>
'use strict';

App.CuratedContentEditorImageSearchComponent = Em.Component.extend(
	App.AlertNotificationsMixin,
	App.CuratedContentEditorThumbnailMixin,
	App.LoadingSpinnerMixin,
	App.CuratedContentEditorLayoutMixin,
	{
		actions: {
			goBack(): void {
				console.log(this.get('imageSearchLayout.previous.name'));
				this.sendAction('changeLayout', this.get('imageSearchLayout.previous.name'));
			},

			done(): void {
				this.sendAction('changeLayout', this.get('imageSearchLayout.next.name'))
			}
		}
});
