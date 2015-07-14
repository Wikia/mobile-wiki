/// <reference path="../app.ts" />
'use strict';

App.MainPageEditComponent = Em.Component.extend({
	actions: {
		openMainPage: function (): void {
			this.sendAction('openMainPage');
		},

		save: function (): void {

		}
	}
});
