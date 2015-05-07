/// <reference path="../app.ts" />
/// <reference path="../../mercury/utils/track.ts" />
'use strict';

App.TrackClickMixin = Em.Mixin.create({
	trackClick: function(category: string, label: string = ''): void {
		M.track({
			action: M.trackActions.click,
			category: category,
			label: label
		});
	},

	actions: {
		trackClick: function (category: string, label: string = ''): void {
			this.trackClick(category, label);
		}
	}
});
