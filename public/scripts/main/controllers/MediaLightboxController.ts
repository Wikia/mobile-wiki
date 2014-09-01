/// <reference path="./LightboxController.ts" />
'use strict';

App.MediaLightboxController = App.LightboxController.extend({
	currentImage: 0,

	currentMedia: function(){
		var current = this.get('model.media')[this.get('currentImage')];

		if (Em.$.isArray(current)) {
			this.set('isGallery', true);
			this.set('galleryLength', current.length - 1);
			this.set('currentGalleryImage', 1);
		} else {
			this.set('isGallery', false);
		}

		return current;
	}.property('model.media', 'currentImage'),

	contents: function(){
		if(this.get('isGallery')) {
			return ('<img src="' + this.get('currentMedia')[this.get('currentGalleryImage')].url + '">').htmlSafe();
		} else {
			return ('<img src="' + this.get('currentMedia').url + '">').htmlSafe();
		}

	}.property('currentMedia', 'isGallery', 'currentGalleryImage'),

	footer: function() {
		if (this.get('isGallery')) {
			return this.get('currentMedia')[this.get('currentGalleryImage')].caption.htmlSafe()
		}
		return this.get('currentMedia').caption.htmlSafe();
	}.property('currentMedia',  'currentGalleryImage', 'isGallery'),

	galleryHeader: function(){
		return this.get('currentGalleryImage') + ' / ' + this.get('galleryLength');
	}.property('galleryLength', 'currentGalleryImage'),

	header: function() {
		if (this.get('isGallery')) {
			return this.get('galleryHeader');
		}
		return 'arft'//this.get('currentMedia').title.htmlSafe();
	}.property('currentMedia', 'isGallery', 'galleryHeader')

});
