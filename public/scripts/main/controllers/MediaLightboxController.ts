/// <reference path="./LightboxController.ts" />
'use strict';

App.MediaLightboxController = App.LightboxController.extend({
	currentImage: 0,

	currentMedia: function(){
		var current = this.get('model.media')[this.get('currentImage')];

		if (Em.$.isArray(current)) {
			this.set('isGallery', true);
			this.set('galleryLength', current.length);
			this.set('currentGalleryImage', 1);
			return current[0];
		} else {
			this.set('isGallery', false);
			return current;
		}
	}.property('model.media', 'currentImage'),

	contents: function(){
		return ('<img src="' + this.get('currentMedia').url + '">').htmlSafe();
	}.property('currentMedia'),

	footer: function() {
		var caption = this.get('currentMedia').caption;

		return caption && caption.htmlSafe();
	}.property('currentMedia'),

	galleryHeader: function(){
		return this.get('currentGalleryImage') + ' / ' + this.get('galleryLength');
	}.property('galleryLength', 'currentGalleryImage'),

	header: function() {
		if (this.get('isGallery')) {
			return this.get('galleryHeader');
		}
		return '';
	}.property('isGallery', 'galleryHeader')

});
