/// <reference path="../app.ts" />
/// <reference path="../mixins/AlertNotificationsMixin.ts" />
/// <reference path="../mixins/CuratedContentEditorThumbnailMixin.ts"/>
/// <reference path="../mixins/LoadingSpinnerMixin.ts" />
///<reference path="../mixins/CuratedContentEditorLayoutMixin.ts"/>
///<reference path="../models/SearchImagesModel.ts"/>
'use strict';

App.CuratedContentEditorImageSearchComponent = Em.Component.extend(
	App.AlertNotificationsMixin,
	App.CuratedContentEditorLayoutMixin,
	App.LoadingSpinnerMixin,
	{
		classNames: ['curated-content-editor-image-search'],
		debounceDuration: 300,
		spinnerOverlay: false,

		searchPlaceholder: Em.computed(function() {
			return i18n.t('app.curated-content-editor-search-images-placeholder');
		}),
		searchPhraseObserver: Em.observer('searchPhrase', function() {
			this.showLoader();

			this.set('imagesModel', App.SearchImagesModel.create({
				searchPhrase: this.get('searchPhrase')
			}));

			Em.run.debounce(this, this.getNextBatch, this.debounceDuration);
		}),

		getNextBatch(): void {
			this.get('imagesModel').next()
				.then((): void => {
					var message: string = null;

					if (Em.isEmpty(this.get('imagesModel').items)) {
						message = i18n.t('app.curated-content-editor-no-images-found');
					}

					this.set('searchMessage', message);
				})
				.catch((error: any): void => {
					Em.Logger.error(error);
					//@TODO CONCF-956 add translations
					this.set('imageErrorMessage', 'Oops! An API Error occured.');
				})
				.finally((): void => {
				this.hideLoader();
				this.set('spinnerOverlay', false);
			});
		},

		actions: {
			goBack(): void {
				this.sendAction('changeLayout', this.get('imageSearchLayout.previous'));
			},

			select(image: SearchPhotoImageResponseInterface): void {
				this.setProperties({
					'model.image_url': image.thumbnailUrl,
					'model.image_id': image.id,
					'imageErrorMessage': null
				});
				this.sendAction('changeLayout', this.get('imageSearchLayout.next'));
			},

			loadMore(): void {
				this.set('spinnerOverlay', true);
				this.showLoader();
				this.getNextBatch();
			}
		}
});
