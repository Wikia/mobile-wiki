'use strict';

App.CuratedContentEditorImageCropRoute = Em.Route.extend({

	renderTemplate(): void {
		this.render('curated-content-editor-image-crop');
	},

	actions: {
		goBack():void {
			this.transitionTo('curatedContentEditor.section.index');
		}
	}
});
