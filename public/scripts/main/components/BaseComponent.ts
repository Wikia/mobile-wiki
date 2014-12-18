/// <reference path="../app.ts" />
'use strict';

App.BaseComponent = Em.Component.extend({
	actions: {
		trackClick: function (category: string, label: string = ''): void {
			M.track({
				action: M.trackActions.click,
				category: category,
				label: label
			});
		}
	}
});
