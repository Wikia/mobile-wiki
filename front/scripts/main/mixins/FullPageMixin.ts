/// <reference path="../app.ts" />
'use strict';

App.FullPageMixin = Em.Mixin.create({
	activate: function (): void {
		this.controllerFor('application').set('fullPage', true);
	},
	deactivate: function (): void {
		this.controllerFor('application').set('fullPage', false);
	}
});
