/// <reference path="../app.ts" />
/// <reference path="../mixins/CuratedContentEditorThumbnailMixin.ts"/>
/// <reference path="../mixins/LoadingSpinnerMixin.ts" />

'use strict';
App.CuratedContentEditorImageCropComponent = Em.Component.extend({

	goBack(): void {
		this.sendAction('goBack');
	}
});
