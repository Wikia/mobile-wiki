/// <reference path="../app.ts" />
'use strict';

App.TrackClickMixin = Em.Mixin.create({
	actions: {
		trackClick: function (category: string, label: string = ''): void {
			this.sendAction('trackClick', category, label);
		}
	}
});
