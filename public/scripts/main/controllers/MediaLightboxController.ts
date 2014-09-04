/// <reference path="./LightboxController.ts" />
'use strict';

App.MediaLightboxController = App.LightboxController.extend({
	needs: 'article',

	file: Ember.computed.alias(
		'controllers.article.file'
	),
	currentMediaRef: 0,
	currentGalleryRef: 2210,
	galleryLength: 0,
	isGallery: false,

	currentGalleryBounder: function(){
		var currentGalleryRef = this.get('currentGalleryRef'),
			galleryLength = this.get('galleryLength') - 1;

		if(currentGalleryRef <= 0) {
			this.set('currentGalleryRef', 0);
		} else if (currentGalleryRef > galleryLength) {
			this.set('currentGalleryRef', galleryLength);
		}

	}.observes('currentGalleryRef'),

	init: function() {
		this.set('model', App.MediaModel.create());

		this.get('model.media').forEach((value: any, key: number) => {
			if (value.title === this.get('file')) {
				this.set('currentMediaRef', parseInt(key, 10));
			}
		});
	},

	currentMedia: function() {
		var current = this.get('model.media')[this.get('currentMediaRef')];

		if (Em.$.isArray(current)) {
			this.set('isGallery', true);
			this.set('galleryLength', current.length);
			this.set('file', current[this.get('currentGalleryRef')].title);

			return current[this.get('currentGalleryRef')];
		} else {
			this.set('isGallery', false);
			this.set('file', current.title);

			return current;
		}
	}.property('model.media', 'currentMediaRef', 'currentGalleryRef'),

	contents: function() {
		return ('<img src="' + this.get('currentMedia').url + '">').htmlSafe();
	}.property('currentMedia'),

	footer: function() {
		var caption = this.get('currentMedia').caption;

		return caption && caption.htmlSafe();
	}.property('currentMedia'),

	galleryHeader: function(){
		return (this.get('currentGalleryRef') + 1) + ' / ' + this.get('galleryLength');
	}.property('galleryLength', 'currentGalleryRef'),

	header: function() {
		if (this.get('isGallery')) {
			return this.get('galleryHeader');
		}
		return '';
	}.property('isGallery', 'galleryHeader')

});
