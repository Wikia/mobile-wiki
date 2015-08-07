/// <reference path="../app.ts" />
/// <reference path="../mixins/AlertNotificationsMixin.ts" />
/// <reference path="../mixins/CuratedContentEditorLayoutMixin.ts"/>
/// <reference path="../mixins/CuratedContentEditorThumbnailMixin.ts"/>
/// <reference path="../mixins/LoadingSpinnerMixin.ts" />

'use strict';

App.CuratedContentEditorImageCropComponent = Em.Component.extend(
	App.AlertNotificationsMixin,
	App.CuratedContentEditorThumbnailMixin,
	App.LoadingSpinnerMixin,
	App.CuratedContentEditorLayoutMixin,
	{
		imgSelector: '.curated-content-editor-photo > img',
		$imgElement: null,

		// https://github.com/fengyuanchen/cropper#options
		cropperSettings: {
			center: false,
			checkImageOrigin: false,
			cropBoxMovable: false,
			cropBoxResizable: false,
			dragCrop: false,
			guides: false,
			highlight: false
		},

		aspectRatio: Em.computed('block', function (): number {
			return this.get('block') === 'featured' ? 16 / 9 : 1;
		}),

		aspectRatioName: Em.computed('block', function (): string {
			return this.get('block') === 'featured' ? 'landscape' : 'square';
		}),

		initCropper: Em.on('didRender', function (): void {
			var $imgElement = this.$(this.get('imgSelector')),
				settings: any = $.extend(this.get('cropperSettings'), {
					aspectRatio: this.get('aspectRatio')
				});

			$imgElement.cropper(settings);
			this.set('$imgElement', $imgElement);
		}),

		actions: {
			goBack(): void {
				this.sendAction('changeLayout', this.get('imageCropLayout.previous.name'));
			},

			done(): void {
				var $imgElement = this.get('$imgElement'),
					// https://github.com/fengyuanchen/cropper#getdatarounded
					cropData = $imgElement.cropper('getData', true),
					imageCrop = {
						x: cropData.x,
						y: cropData.y,
						width: cropData.width,
						height: cropData.height
					};

				this.setProperties({
					'model.image_url': this.get('imageProperties.url'),
					// article_id comes from MW because in MW files are like any other articles
					// so there is no such thing as image_id from MW perspective.
					'model.image_id': this.get('imageProperties.article_id'),
					'imageErrorMessage': null
				});

				switch (this.get('cropperSettings.aspectRatio')) {
					case 16 / 9:
						this.setProperties({
							'model.image_crop': {
								landscape: imageCrop
							}
						});
						break;
					case 1:
						this.setProperties({
							'model.image_crop': {
								portrait: imageCrop
							}
						});
						break;
				}

				this.sendAction('changeLayout', this.get('imageCropLayout.next.name'))
			}
		}
});
