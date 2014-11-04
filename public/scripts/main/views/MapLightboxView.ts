/// <reference path="../app.ts" />
/// <reference path="./LightboxView.ts" />
'use strict';

interface Window {
	scrollY: number;
}

App.MapLightboxView = App.LightboxView.extend({
	classNames: ['map-lightbox'],
	templateName: 'app/map-lightbox',
	//opening, open
	//before didInsertElement the lightbox is opening
	status: 'opening',

	viewportSize: function () {
		return {
			width: window.innerWidth,
			height: window.innerHeight
		};
	}.property(),

	/**
	 * @desc property that holds current image
	 */
	image: function (): JQuery {
		return this.$('.current');
	}.property(),

	imageWidth: function (): number {
		return this.get('image').width() * this.get('scale');
	}.property('image', 'scale'),

	imageHeight: function (): number {
		return this.get('image').height() * this.get('scale');
	}.property('image', 'scale'),


	/**
	 * @method currentMediaObserver
	 * @description Used to check if media if video after the lightbox current
	 * view has been updated. This is so that any specific embed markup is loaded
	 * before we try to instantiate player controls.
	 */
	currentMapObserver: function (): void {
		var currentMap = this.get('controller.currentMap');
	}.observes('controller.currentMap'),

	/**
	 * @desc used to animate image that is in article into a media lightbox
	 */
	animateMedia: function (image?: HTMLElement): void {
		if (image) {
			var $image = $(image).find('img'),
			    offset = $image.offset(),
			    $imageCopy = $image.clone(),
			    width = $image.width(),
			    viewportSize = this.get('viewportSize'),
			    deviceWidth = viewportSize.width;

			//initial style, mimic the image that is in page
			$imageCopy.css({
				top: offset.top - window.scrollY + 'px',
				left: offset.left + 'px',
				width: width + 'px'
				//for static css properties see _media_lightbox.scss
			}).addClass('animated-media');

			this.$().append($imageCopy);

			//animate to full width and middle of screen
			$imageCopy.css({
				width: deviceWidth + 'px',
				//half of - device height minus height of the animated image multiplied by scale
				top: ((viewportSize.height - ($image.height() * (deviceWidth / width))) / 2) + 'px',
				left: 0
			}).one('webkitTransitionEnd, transitionend', function () {
				$imageCopy.remove();
			});
		}
	},

	didInsertElement: function (): void {
		var onResize = () => {
			this.notifyPropertyChange('viewportSize');
			this.notifyPropertyChange('imageWidth');
			this.notifyPropertyChange('imageHeight');
		};

		//disabled for now, we can make it better when we have time
		//this.animateMedia(this.get('controller').get('element'));
		this.set('status', 'open');

		$(window).on('resize', onResize);
		this.set('onResize', onResize);

		this._super();
	},

	willDestroyElement: function (): void {
		$(window).off('resize', this.get('onResize'));
		this.get('controller').reset();
		this._super();
	}
});
