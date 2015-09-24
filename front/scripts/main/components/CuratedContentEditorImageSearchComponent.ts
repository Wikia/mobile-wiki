/// <reference path="../app.ts" />
/// <reference path="../mixins/AlertNotificationsMixin.ts" />
/// <reference path="../mixins/LoadingSpinnerMixin.ts" />
/// <reference path="../mixins/CuratedContentThumbnailMixin.ts"/>
/// <reference path="../mixins/CuratedContentEditorLayoutMixin.ts"/>
/// <reference path="../mixins/TrackClickMixin.ts"/>
/// <reference path="../models/SearchImagesModel.ts"/>
///<reference path="../mixins/IEIFrameFocusFixMixin.ts"/>
///<reference path="../mixins/CuratedContentEditorLabelsMixin.ts"/>
'use strict';

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
		searchPlaceholder: Em.computed((): string =>
			i18n.t('app.curated-content-editor-search-images-placeholder')
		),

		searchQueryObserver: Em.observer('searchQuery', function(): void {
			var searchQuery: string = this.get('searchQuery');

			this.set('imagesModel', App.SearchImagesModel.create({
				searchQuery
			}));

			if (!Em.isEmpty(searchQuery)) {
				this.showLoader();

				Em.run.debounce(this, this.getNextBatch, this.debounceDuration);
			}
		}),

		actions: {
			goBack(): void {
				this.trackClick('curated-content-editor', 'image-search-go-back');
				this.sendAction('changeLayout', this.get('imageSearchLayout.previous'));
			},

			select(image: SearchPhotoImageResponseInterface): void {
				this.trackClick('curated-content-editor', 'image-search-select');
				this.setProperties({
					'imageProperties.url': image.url,
					'imageProperties.id': image.id,
					// Make cropper back button go back here
					'imageCropLayout.previous': this.get('imageSearchLayout.name')
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
