/// <reference path="../app.ts" />
/// <reference path="./LightboxView.ts" />
'use strict';

App.MapLightboxView = App.LightboxView.extend({
	classNames: ['map-lightbox'],
	templateName: 'app/map-lightbox',
	status: 'opening',
	height: 0,

	didInsertElement: function (): void {
		this.set('status', 'open');

		this._super();
	},

	style: function (): string {
		var captionBarHeight = 40,
			mapHeight = window.innerHeight - captionBarHeight;
		return ('height: ' + mapHeight + 'px;');
	}.property('height'),

	willDestroyElement: function (): void {
		$(window).off('resize', this.get('onResize'));
		this.get('controller').reset();

		this._super();
	}
});
