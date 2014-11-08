/// <reference path="../app.ts" />
/// <reference path="./LightboxView.ts" />
'use strict';

App.MapLightboxView = App.LightboxView.extend({
	classNames: ['map-lightbox'],
	templateName: 'app/map-lightbox',
	status: 'opening',
	height: 0,
	width: 0,
	bottom: 0,

	didInsertElement: function (): void {
		this._super();
		this.set('status', 'open');
	},

	style: function (): string {
		//var footerHeight = $('div.lightbox-footer').height(); //for now the footer height is hardcoded below
		var footerHeight = 46,
			lightboxWithoutFooterHeight = window.innerHeight - footerHeight;
		return ('height: ' + lightboxWithoutFooterHeight + 'px; width: 100%; position: fixed; top: 0px; left: 0px');
	}.property('height', 'width'),

	willDestroyElement: function (): void {
		$(window).off('resize', this.get('onResize'));
		this.get('controller').reset();
		this._super();
	}
});