/// <reference path="../app.ts" />
'use strict';

App.ArticleAddPhotoComponent = Em.Component.extend({
	classNames: ['addphoto-component'],

	actions: {
		back: function (): void {
			this.sendAction('back');

			M.track({
				action: M.trackActions.click,
				category: 'sectionaddphoto',
				label: 'back'
			});
		},
		upload: function (): void {
			this.sendAction('upload');

			M.track({
				action: M.trackActions.click,
				category: 'sectionaddphoto',
				label: 'upload'
			});
		}
	}
});
