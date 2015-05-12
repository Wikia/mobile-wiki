/// <reference path="../app.ts" />
/// <reference path="../../mercury/utils/track.ts" />
'use strict';

App.TrackClickMixin = Em.Mixin.create({
	trackClick: function(category: string, label: string = '', isInteractive: boolean = false): void {
		M.track({
			action: M.trackActions.click,
			category: category,
			label: label,
			isInteractive: isInteractive
		});
	},

	actions: {
		trackClick: function (category: string, label: string = '', isInteractive: boolean = false): void {
			this.trackClick(category, label, isInteractive);
		}
	}
});
