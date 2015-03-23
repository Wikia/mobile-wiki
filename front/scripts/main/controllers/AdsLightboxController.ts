/// <reference path="./LightboxController.ts" />

App.AdsLightboxController = App.LightboxController.extend({
	data: {
		contents: null
	},

	contents: Em.computed.alias(
		'data.contents'
	),

	footerHidden: true,

	header: 'Advertisment',

	init: function (): void {
		this._super();
	},

	reset: function (): void {
		this.setProperties({
			data: {}
		});

		this._super();
	}
});
