import App from '../app';
import CuratedContentEditorLayoutMixin from '../mixins/curated-content-editor-layout';
import CuratedContentThumbnailMixin from '../mixins/curated-content-thumbnail';
import TrackClickMixin from '../mixins/track-click';
import ViewportMixin from '../mixins/viewport';

export default App.CuratedContentEditorImageCropComponent = Ember.Component.extend(
	CuratedContentEditorLayoutMixin,
	CuratedContentThumbnailMixin,
	TrackClickMixin,
	ViewportMixin,
	{
		imgSelector: '.curated-content-editor-photo-crop > img',
		$imgElement: null,
		cropperInitialized: false,
		imagePropertiesUrl: Ember.computed('imageProperties.url', 'model.image_url', function () {
			const imagePropertiesUrl = this.get('imageProperties.url');

			return Ember.isEmpty(imagePropertiesUrl) ? this.get('model.image_url') : imagePropertiesUrl;
		}),

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
		currentCropperSettings: Ember.computed('aspectRatio', function () {
			return $.extend(this.get('defaultCropperSettings'), {
				aspectRatio: this.get('aspectRatio')
			});
		}),

		actions: {
			/**
			 * @returns {void}
			 */
			goBack() {
				this.trackClick('curated-content-editor', 'image-crop-go-back');
				this.sendAction('changeLayout', this.get('imageCropLayout.previous'));
			},

			/**
			 * @returns {void}
			 */
			done() {
				const $imgElement = this.get('$imgElement'),
					model = this.get('model'),
					imageUrl = this.get('imagePropertiesUrl'),
					imageId = this.get('imageProperties.id');

				let cropData,
					imageCrop;

				this.trackClick('curated-content-editor', 'image-crop-done');

				// Set values on model only if imageProperties are set.
				// When cropping already added image values on model are already set
				// - no need to set them to the same ones.
				if (!Ember.isEmpty(imageUrl) && !Ember.isEmpty(imageId)) {
					model.setProperties({
						image_url: imageUrl,
						image_id: imageId
					});
				}

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

				this.sendAction('changeLayout', this.get('imageCropLayout.next'));
			}
		},

		/**
		 * Show loading spinner until image is loaded as the cropper can be displayed only after that
		 *
		 * @returns {void}
		 */
		loadImage: Ember.on('didInitAttrs', function () {
			const url = this.get('imagePropertiesUrl');
			let image;

			if (url) {
				this.set('isLoading', true);

				image = new Image();
				image.onload = () => this.onImageLoaded();
				image.src = url;
			}
		}),

		/**
		 * @returns {void}
		 */
		onImageLoaded() {
			// User can browse away from the component before this function is called
			// Abort when that happens
			if (this.get('isDestroyed')) {
				return;
			}

			this.set('imageUrl', this.get('imagePropertiesUrl'));

			// Wait until image is rendered
			Ember.run.scheduleOnce('afterRender', this, this.initCropper);
		},

		/**
		 * @returns {void}
		 */
		initCropper() {
			const $imgElement = this.$(this.get('imgSelector'));

			if (!this.get('cropperInitialized')) {
				$imgElement.cropper(this.get('currentCropperSettings'));

				this.setProperties({
					isLoading: false,
					cropperInitialized: true,
					$imgElement
				});
			}
		},

		/**
		 * @returns {void}
		 */
		onResize() {
			const $imgElement = this.get('$imgElement');

			if (this.get('cropperInitialized')) {
				// re-init cropper according to https://github.com/fengyuanchen/cropper/issues/421
				$imgElement.cropper('destroy');
				$imgElement.cropper(this.get('currentCropperSettings'));
			}
		}
	}
);
