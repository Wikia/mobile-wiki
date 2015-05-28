/// <reference path="../app.ts" />
'use strict';

App.LightboxAdsComponent = Em.Component.extend({
	classNames: ['lightbox-content-inner'],

	data: {
		contents: null
	},
	contents: Em.computed.alias('data.contents'),
	footerHidden: true,
	header: 'Advertisement',

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
