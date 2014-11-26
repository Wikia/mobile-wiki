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

	willDestroyElement: function (): void {
		this.get('controller').reset();

		this._super();
	}
});
