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
				items: SearchPhotoImageResponseInterface[]
			}
		},
		limit: number;
		batch: number;
	},
	error?: any
}

interface SearchPhotoImageResponseInterface {
	title: string;
	type: string;
	url: string;
	width: string;
	height: string;
	thumbnailUrl?: string;
}

App.CuratedContentEditorImageSearchComponent = Em.Component.extend(
	App.AlertNotificationsMixin,
	App.CuratedContentEditorThumbnailMixin,
	App.LoadingSpinnerMixin,
	App.CuratedContentEditorLayoutMixin,
	{
		classNames: ['curated-content-editor-image-search'],
		debounceDuration: 300,
		imageSize: 200,
		searchLimit: 24,
		nextBatch: 1,
		batches: 1,
		images: [],

		hasNextBatch: Em.computed('batches', 'nextBatch', function() {
			return this.get('batches') > this.get('nextBatch');
		}),

		searchPhraseObserver: Em.observer('searchPhrase', function() {
			this.showLoader();
			this.setProperties({
				nextBatch: 1,
				batches: 1,
				images: []
			});

			Em.run.debounce(this, this.getImages, this.debounceDuration);
		}),

		setImages(fetchedImages: SearchPhotoImageResponseInterface[]) {
			var images = this.get('images');

			this.set('images',
				images.concat(
					fetchedImages.map((image: SearchPhotoImageResponseInterface) => {
						image.thumbnailUrl = this.generateThumbUrl(image.url);

						return image;
					})
				)
			);
		},

		getImages(): void {
			this.fetchImagesFromAPI(this.get('searchPhrase'))
				.done((data: SearchPhotoResponseInterface): void => {
					if (!data.error) {
						var fetchedImages = data.response.results.photo.items;

						if (Em.isEmpty(fetchedImages)) {
							this.set('searchMessage', 'app.curated-content-editor-no-images-found');
						} else {
							this.setImages(fetchedImages);
							this.set('batches', data.response.results.photo.batches);
						}
					}
				})
				.fail((err: any): void => {
					Em.Logger.error(err);
					//@TODO CONCF-956 add translations
					this.set('imageErrorMessage', 'Oops! An API Error occured.');
				})
				.always((): void => this.hideLoader());
		},

		fetchImagesFromAPI(searchPhrase: string): Em.RSVP.Promise {
			return Em.$.getJSON(
				M.buildUrl({
					path: '/api.php',
				}),
				{
					format: 'json',
					action: 'apimediasearch',
					query: searchPhrase,
					type: 'photo',
					batch: this.get('nextBatch'),
					limit: this.searchLimit
				}
			);
		},

		actions: {
			goBack(): void {
				this.sendAction('changeLayout', this.get('imageSearchLayout.previous.name'));
			},

			done(): void {
				this.sendAction('changeLayout', this.get('imageSearchLayout.next.name'))
			},

			loadMore(): void {
				this.incrementProperty('nextBatch');
				this.showLoader();
				this.getImages();
			}
		}
});
