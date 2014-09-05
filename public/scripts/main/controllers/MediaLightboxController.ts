/// <reference path="./LightboxController.ts" />
'use strict';

App.MediaLightboxController = App.LightboxController.extend({
	needs: 'article',

	file: Ember.computed.alias(
		'controllers.article.file'
	),
	currentMediaRef: undefined,
	//default image in gallery is 0th
	currentGalleryRef: 0,
	//element on a page that will be animated
	element: null,

	init: function() {
		this.set('model', App.MediaModel.create());

		var file = this.get('file');

		this.get('model.media').some((media: any, key: number) => {
			if (Em.isArray(media)) {
				return media.some((galleryMedia: any, galleryKey: number) => {
					if (galleryMedia.title === file) {
						this.setProperties({
							currentMediaRef: key,
							currentGalleryRef: galleryKey
						});
						return true;
					} else {
						return false;
					}
				})
			} else if (media.title === file) {
				this.set('currentMediaRef', key);
				return true;
			}

			return false;
		});
	},

	galleryBoundries: function() {
		var currentGalleryRef = this.get('currentGalleryRef'),
			galleryLength = this.get('galleryLength') - 1;

		if (currentGalleryRef < 0) {
			this.set('currentGalleryRef', galleryLength);
		} else if (currentGalleryRef > galleryLength) {
			this.set('currentGalleryRef', 0);
		}

	}.observes('currentGalleryRef', 'galleryLength'),

	isGallery: function() {
		return Em.isArray(this.get('current'));
	}.property('current'),

	current: function(){
		return this.get('model.media')[this.get('currentMediaRef')];
	}.property('model.media', 'currentMediaRef'),

	currentMedia: function() {
		var current = this.get('current');

		if (this.get('isGallery')) {
			return current[this.get('currentGalleryRef')];
		} else {
			return current;
		}
	}.property('current', 'isGallery', 'currentGalleryRef'),

	galleryLength: function() {
		if (this.get('isGallery')) {
			return this.get('current').length;
		} else {
			return false;
		}
	}.property('isGallery', 'current'),

	currentMediaObserver: function() {
		var currentMedia = this.get('currentMedia');

		if (currentMedia) {
			this.set('file', currentMedia.title);
		} else {
			this.set('file', null);
		}
	}.observes('currentMedia'),

	contents: function() {
		var currentMedia = this.get('currentMedia');

		if (currentMedia) {
			return ('<img src="' + this.get('currentMedia').url + '">').htmlSafe();
		} else {
			return 'Something wrong';
		}
	}.property('currentMedia'),

	footer: function() {
		var currentMedia = this.get('currentMedia');

		if (currentMedia) {
			var caption = currentMedia.caption;

			return caption && caption.htmlSafe();
		} else {
			return '';
		}
	}.property('currentMedia'),

	galleryHeader: function(){
		return (this.get('currentGalleryRef') + 1) + ' / ' + this.get('galleryLength');
	}.property('galleryLength', 'currentGalleryRef'),

	header: function() {
		if (this.get('isGallery')) {
			return this.get('galleryHeader');
		}
		return '';
	}.property('isGallery', 'galleryHeader'),

	reset: function(){
		this.setProperties({
			currentMediaRef: undefined,
			currentGalleryRef: 0,
			file: null
		});
	}
});
