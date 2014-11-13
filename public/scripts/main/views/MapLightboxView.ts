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
		var captionBarHeight = 46,
			mapHeight = window.innerHeight - captionBarHeight;
		return ('height: ' + mapHeight + 'px; width: 100%; position: fixed; bottom: 0px; left: 0px');
	}.property('height', 'width'),

	willDestroyElement: function (): void {
		$(window).off('resize', this.get('onResize'));
		this.get('controller').reset();
		this._super();
	}
});