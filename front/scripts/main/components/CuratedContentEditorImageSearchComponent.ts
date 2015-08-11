/// <reference path="../app.ts" />
/// <reference path="../mixins/AlertNotificationsMixin.ts" />
/// <reference path="../mixins/CuratedContentEditorThumbnailMixin.ts"/>
/// <reference path="../mixins/LoadingSpinnerMixin.ts" />
/// <reference path="../mixins/CuratedContentEditorLayoutMixin.ts"/>
/// <reference path="../models/SearchImagesModel.ts"/>
/// <reference path="../mixins/TrackClickMixin.ts"/>
'use strict';

App.CuratedContentEditorImageSearchComponent = Em.Component.extend(
	App.AlertNotificationsMixin,
	App.CuratedContentEditorLayoutMixin,
	App.LoadingSpinnerMixin,
	App.TrackClickMixin,
	{
		classNames: ['curated-content-editor-image-search'],
		debounceDuration: 300,
		spinnerOverlay: false,

		searchPlaceholder: Em.computed((): string =>
			i18n.t('app.curated-content-editor-search-images-placeholder')
		),

		searchQueryObserver: Em.observer('searchQuery', function(): void {
			this.showLoader();

			this.set('imagesModel', App.SearchImagesModel.create({
				searchQuery: this.get('searchQuery')
			}));

			Em.run.debounce(this, this.getNextBatch, this.debounceDuration);
		}),

		actions: {
			goBack(): void {
				this.trackClick('curated-content-editor', 'image-search-go-back');
				this.sendAction('changeLayout', this.get('imageSearchLayout.previous'));
			},

			select(image: SearchPhotoImageResponseInterface): void {
				this.trackClick('curated-content-editor', 'image-search-select');
				this.setProperties({
					'model.image_url': image.thumbnailUrl,
					'model.image_id': image.id,
					'imageErrorMessage': null
				});
				this.sendAction('changeLayout', this.get('imageSearchLayout.next'));
			},

			loadMore(): void {
				this.trackClick('curated-content-editor', 'image-search-load-more');
				this.set('spinnerOverlay', true);
				this.showLoader();
				this.getNextBatch();
			}
		},

		getNextBatch(): void {
			this.get('imagesModel').next()
				.catch((error: any): void => {
					Em.Logger.error(error);

					this.set('searchMessage', i18n.t('app.curated-content-editor-no-images-found'));
				})
				.finally((): void => {
					this.hideLoader();
					this.set('spinnerOverlay', false);
				});
		}
});
