/// <reference path="../app.ts" />
/// <reference path="./LightboxView.ts" />
'use strict';

App.MapLightboxView = App.LightboxView.extend({
	classNames: ['map-lightbox'],
	templateName: 'app/map-lightbox',
	status: 'opening',

	didInsertElement: function (): void {
		this.set('status', 'open');

		this._super();
	},

	style: function (): string {
		var titleBarHeight = 40,
			mapHeight = window.innerHeight - titleBarHeight;

		return 'height:%@px;'.fmt(mapHeight);
	}.property(),

	willDestroyElement: function (): void {
		this.get('controller').reset();

		this._super();
	}
});
