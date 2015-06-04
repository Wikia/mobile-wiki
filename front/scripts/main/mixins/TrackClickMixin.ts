/// <reference path="../app.ts" />
/// <reference path="../../mercury/utils/track.ts" />
'use strict';

App.TrackClickMixin = Em.Mixin.create({
	trackClick: function(category: string, label: string = '', isNonInteractive: boolean = true): void {
		M.track({
			action: M.trackActions.click,
			category: category,
			label: label,
			isNonInteractive: isNonInteractive
		});
	},

	actions: {
		trackClick: function (category: string, label: string = '', isNonInteractive: boolean = true): void {
			this.trackClick(category, label, isNonInteractive);
		},
		trackClickAndFollow: function (
			url: string, category: string,
			label: string = '',
			isNonInteractive: boolean = true,
			newTab: boolean = false
		): void {
			this.trackClick(category, label, isNonInteractive);
			if (!url) {
				throw new Error('trackClickAndFollow needs an href to follow')
			}
			if (newTab) {
				window.open(url);
			} else {
				window.location.assign(url);
			}
		}
	}
});
