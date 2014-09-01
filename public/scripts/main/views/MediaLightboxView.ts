/// <reference path="../app.ts" />
'use strict';

App.MediaLightboxView = App.LightboxView.extend({
	classNames: ['media-lightbox'],

	keyDown: function(event: JQueryEventObject){
		if (event.keyCode === 39) {
			this.get('controller').incrementProperty('currentGalleryImage')
		} else if (event.keyCode === 37){
			this.get('controller').decrementProperty('currentGalleryImage')
		}

		this._super(event);
	}
});

