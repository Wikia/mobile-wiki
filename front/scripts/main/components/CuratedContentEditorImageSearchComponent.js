App.CuratedContentEditorImageSearchComponent = Em.Component.extend(
	App.AlertNotificationsMixin,
	App.CuratedContentEditorLabelsMixin,
	App.CuratedContentEditorLayoutMixin,
	App.CuratedContentThumbnailMixin,
	App.LoadingSpinnerMixin,
	App.TrackClickMixin,
	App.IEIFrameFocusFixMixin,
	{
		classNames: ['curated-content-editor-image-search'],
		debounceDuration: 300,
		spinnerOverlay: false,
		searchPlaceholder: Em.computed(() =>
			i18n.t('app.curated-content-editor-search-images-placeholder')
		),

		searchQueryObserver: Em.observer('searchQuery', function() {
			const searchQuery = this.get('searchQuery');

			this.set('imagesModel', App.SearchImagesModel.create({
				searchQuery
			}));

			if (!Em.isEmpty(searchQuery)) {
				this.showLoader();

				Em.run.debounce(this, this.getNextBatch, this.debounceDuration);
			}
		}),

		actions: {
			/**
			 * @returns {void}
			 */
			goBack() {
				this.trackClick('curated-content-editor', 'image-search-go-back');
				this.sendAction('changeLayout', this.get('imageSearchLayout.previous'));
			},

			/**
			 * @param {SearchPhotoImageResponseInterface} image
			 * @returns {void}
			 */
			select(image) {
				this.trackClick('curated-content-editor', 'image-search-select');
				this.setProperties({
					'imageProperties.url': image.url,
					'imageProperties.id': image.id,
					// Make cropper back button go back here
					'imageCropLayout.previous': this.get('imageSearchLayout.name')
				});
				this.sendAction('changeLayout', this.get('imageSearchLayout.next'));
			},

			/**
			 * @returns {void}
			 */
			loadMore() {
				this.trackClick('curated-content-editor', 'image-search-load-more');
				this.set('spinnerOverlay', true);
				this.showLoader();
				this.getNextBatch();
			}
		},

		/**
		 * @returns {void}
		 */
		getNextBatch() {
			this.get('imagesModel').next()
				.catch((error) => {
					Em.Logger.error(error);

					this.set('searchMessage', i18n.t('app.curated-content-editor-no-images-found'));
				})
				.finally(() => {
					this.hideLoader();
					this.set('spinnerOverlay', false);
				});
		}
	}
);
