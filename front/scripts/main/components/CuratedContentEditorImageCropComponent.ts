/// <reference path="../app.ts" />
/// <reference path="../mixins/AlertNotificationsMixin.ts" />
/// <reference path="../mixins/CuratedContentEditorLayoutMixin.ts"/>
/// <reference path="../mixins/CuratedContentThumbnailMixin.ts"/>
/// <reference path="../mixins/TrackClickMixin.ts"/>
/// <reference path="../mixins/ViewportMixin.ts"/>

'use strict';

App.CuratedContentEditorImageCropComponent = Em.Component.extend(
	App.AlertNotificationsMixin,
	App.CuratedContentEditorLayoutMixin,
	App.CuratedContentThumbnailMixin,
	App.TrackClickMixin,
	App.ViewportMixin,
	{
		imgSelector: '.curated-content-editor-photo-crop > img',
		$imgElement: null,
		isLoading: false,
		cropperInitialized: false,

		// https://github.com/fengyuanchen/cropper#options
		defaultCropperSettings: {
			autoCropArea: 1,
			background: false,
			center: false,
			checkImageOrigin: false,
			cropBoxMovable: false,
			cropBoxResizable: false,
			dragCrop: false,
			guides: false,
			highlight: false
		},
		currentCropperSettings: Em.computed('aspectRatio', function() {
			return $.extend(this.get('defaultCropperSettings'), {
				aspectRatio: this.get('aspectRatio')
			});
		}),

		actions: {
			goBack(): void {
				this.trackClick('curated-content-editor', 'image-crop-go-back' );
				this.sendAction('changeLayout', this.get('imageCropLayout.previous'));
			},

			done(): void {
				this.trackClick('curated-content-editor', 'image-crop-done' );
				var $imgElement = this.get('$imgElement'),
					model = this.get('model'),
					cropData: any,
					imageCrop: any;

				model.setProperties({
					'image_url': this.get('imageProperties.url'),
					'image_id': this.get('imageProperties.id')
				});

				// If user clicks DONE before image is loaded we ignore cropping
				if ($imgElement) {
					// https://github.com/fengyuanchen/cropper#getdatarounded
					cropData = $imgElement.cropper('getData', true);
					imageCrop = {
						x: cropData.x,
						y: cropData.y,
						width: cropData.width,
						height: cropData.height
					};

					if (model.image_crop === null) {
						model.set('image_crop', {});
					}

					model.image_crop[this.get('aspectRatioName')] = imageCrop;
				}

				this.sendAction('changeLayout', this.get('imageCropLayout.next'))
			}
		},

		/**
		 * @desc Show loading spinner until image is loaded as the cropper can be displayed only after that
		 */
		loadImage: Em.on('didInitAttrs', function (): void {
			var url = this.get('imageProperties.url'),
				image: HTMLImageElement;

			if (url) {
				this.set('isLoading', true);

				image = new Image();
				image.onload = (): void => this.onImageLoaded();
				image.src = url;
			}
		}),

		onImageLoaded(): void {
			// User can browse away from the component before this function is called
			// Abort when that happens
			if (this.get('isDestroyed')) {
				return;
			}

			this.set('imageUrl', this.get('imageProperties.url'));

			// Wait until image is rendered
			Em.run.scheduleOnce('afterRender', this, this.initCropper);
		},

		initCropper(): void {
			var $imgElement = this.$(this.get('imgSelector'));

			if (!this.get('cropperInitialized')) {
				$imgElement.cropper(this.get('currentCropperSettings'));

				this.setProperties({
					isLoading: false,
					cropperInitialized: true,
					$imgElement
				});
			}
		},

		onResize(): void {
			var $imgElement = this.get('$imgElement');

			if (this.get('cropperInitialized')) {
				// re-init cropper according to https://github.com/fengyuanchen/cropper/issues/421
				$imgElement.cropper('destroy');
				$imgElement.cropper(this.get('currentCropperSettings'));
			}

		}

});
