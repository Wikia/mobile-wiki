/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury.d.ts" />
/// <reference path="../mixins/VisibilityStateManager.ts" />
'use strict';

App.EditController = Em.Controller.extend({
    needs: ['application'],
    init: function() : void {
    },
	actions: {
		publish: function (): void {
			console.log('publish', this.model.content);
		}
	},
});
