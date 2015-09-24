/// <reference path="../app.ts" />
'use strict';

App.ArticleAddPhotoComponent = Em.Component.extend({
	classNames: ['addphoto-component'],

	track: function (label: string): void {
		M.track({
			action: M.trackActions.click,
			category: 'sectionaddphoto',
			label: label
		});
	},

	actions: {
		back: function (): void {
			this.sendAction('back');
			this.track('back');
		},
		upload: function (): void {
			this.sendAction('upload');
			this.track('upload');
		}
	}
});
