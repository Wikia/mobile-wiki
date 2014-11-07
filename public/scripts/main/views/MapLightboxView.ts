/// <reference path="../app.ts" />
/// <reference path="./LightboxView.ts" />
'use strict';

App.MapLightboxView = App.LightboxView.extend({
	classNames: ['map-lightbox'],
	templateName: 'app/map-lightbox',
	status: 'opening',
	headerHidden: true,

	viewportSize: function () {
		return {
			width: window.innerWidth,
			height: window.innerHeight
		};
	}.property(),



	didInsertElement: function (): void {
		var onResize = () => {
			this.notifyPropertyChange('viewportSize');
		};

		//disabled for now, we can make it better when we have time
		//this.animateMedia(this.get('controller').get('element'));
		this.set('status', 'open');
		this.set('headerHidden', 'true');

		this._super();
	},

	willDestroyElement: function (): void {
		$(window).off('resize', this.get('onResize'));
		this.get('controller').reset();
		this._super();
	}
});