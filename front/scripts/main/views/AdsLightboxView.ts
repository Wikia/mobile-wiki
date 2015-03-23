/// <reference path="../app.ts" />
/// <reference path="./LightboxView.ts" />
'use strict';

App.AdsLightboxView = App.LightboxView.extend({
	classNames: ['ads-lightbox'],
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
