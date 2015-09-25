/// <reference path="../app.ts" />
'use strict';

App.ArticleAddPhotoComponent = Em.Component.extend({
	track(label: string): void {
		M.track({
			action: M.trackActions.click,
			category: 'sectionaddphoto',
			label: label
		});
	},

	actions: {
		back(): void {
			this.sendAction('back');
			this.track('back');
		},
		upload(): void {
			this.sendAction('upload');
			this.track('upload');
		}
	}
});
