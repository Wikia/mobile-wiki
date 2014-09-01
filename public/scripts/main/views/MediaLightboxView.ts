/// <reference path="../app.ts" />
'use strict';

App.MediaLightboxView = App.LightboxView.extend({
	classNames: ['media-lightbox'],

	click: function(){
		this.get('controller').incrementProperty('currentGalleryImage')
	}
});

