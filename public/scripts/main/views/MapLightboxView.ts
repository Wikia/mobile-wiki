/// <reference path="../app.ts" />
/// <reference path="./LightboxView.ts" />
'use strict';

App.MapLightboxView = App.LightboxView.extend({
	classNames: ['map-lightbox'],
	templateName: 'app/map-lightbox',
	status: 'opening',
	headerHidden: true,
	height: 0,
	width: 0,


	didInsertElement: function (): void {
		this._super();
		this.set('status', 'open');
	},

	style: function (): string {
		return ('height: 100%;' + ' width: 100%;');
	}.property('height', 'width'),

	willDestroyElement: function (): void {
		$(window).off('resize', this.get('onResize'));
		this.get('controller').reset();
		this._super();
	}
});