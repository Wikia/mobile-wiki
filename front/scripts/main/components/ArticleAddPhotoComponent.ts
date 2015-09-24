/// <reference path="../app.ts" />
'use strict';

App.ArticleAddPhotoComponent = Em.View.extend({
	classNames: ['addphoto-component'],

	actions: {
		back: function (): void {
			this.sendAction('back');
		},
		upload: function (): void {
			this.sendAction('upload');
		}
	}
});
