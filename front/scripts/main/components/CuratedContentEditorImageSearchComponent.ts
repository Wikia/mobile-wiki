/// <reference path="../app.ts" />
/// <reference path="../mixins/AlertNotificationsMixin.ts" />
/// <reference path="../mixins/CuratedContentEditorThumbnailMixin.ts"/>
/// <reference path="../mixins/LoadingSpinnerMixin.ts" />
///<reference path="../mixins/CuratedContentEditorLayoutMixin.ts"/>
'use strict';
interface SearchPhotoResponseInterface {
	response?: {
		results: {
			photo: {
				batches: number;
				items: SearchPhotoImageResponseInterface[];
			};
		};
		limit: number;
		batch: number;
	};
	error?: any
}

interface SearchPhotoImageResponseInterface {
	title: string;
	type: string;
	url: string;
	width: string;
	height: string;
	thumbnailUrl?: string;
	id: number;
}

App.CuratedContentEditorImageSearchComponent = Em.Component.extend(
	App.AlertNotificationsMixin,
	App.CuratedContentEditorLayoutMixin,
	App.CuratedContentEditorThumbnailMixin,
	App.LoadingSpinnerMixin,
	{
		classNames: ['curated-content-editor-image-search'],
		debounceDuration: 300,
		imageSize: 200,
		searchLimit: 24,
		nextBatch: 1,

		searchPhraseObserver: Ember.observer('searchPhrase', function() {
			this.showLoader();
			Em.run.debounce(this, this.getImages, this.get('debounceDuration'));
		}),

		getImages(): void {
			this.fetchImagesFromAPI(this.get('searchPhrase'))
				.then((data: SearchPhotoResponseInterface): void => {
					if (!data.error) {
						var images = data.response.results.photo.items;
						if (Em.isEmpty(images)) {
							this.set('searchMessage', i18n.t('app.curated-content-editor-no-images-found'));
						} else {
							images.forEach((image:SearchPhotoImageResponseInterface) => {
								image.thumbnailUrl = this.generateThumbUrl(image.url);
							});
							this.set('searchMessage', null);
						}
						this.set('images', images);
					}
				})
				.catch((err: any): void => {
					Em.Logger.error(err);
					//@TODO CONCF-956 add translations
					this.set('imageErrorMessage', 'Oops! An API Error occured.');
				})
				.finally((): void => this.hideLoader());
		},

		fetchImagesFromAPI(searchPhrase: string): Em.RSVP.Promise {
			return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
				Em.$.ajax({
					url: M.buildUrl({
						path: '/api.php',
					}),
					data: {
						format: 'json',
						action: 'apimediasearch',
						query: searchPhrase,
						type: 'photo',
						batch: this.get('nextBatch'),
						limit: this.get('searchLimit')
					},
					dataType: 'json',
					success: (data: SearchPhotoResponseInterface): void => {
						resolve(data);
					},
					error: (data: any): void => {
						reject(data);
					}
				});
			});
		},

		actions: {
			goBack(): void {
				this.sendAction('changeLayout', this.get('imageSearchLayout.previous'));
			},

			select(image: SearchPhotoImageResponseInterface): void {
				this.setProperties({
					'imageProperties.url': image.thumbnailUrl,
					'imageProperties.id': image.id,
					// Make cropper back button go back here
					'imageCropLayout.previous': this.get('imageSearchLayout.name')
				});

				this.sendAction('changeLayout', this.get('imageSearchLayout.next'));
			}
		}
});
