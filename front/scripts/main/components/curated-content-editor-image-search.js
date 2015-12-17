import App from '../app';
import CuratedContentEditorLabelsMixin from '../mixins/curated-content-editor-labels';
import CuratedContentEditorLayoutMixin from '../mixins/curated-content-editor-layout';
import CuratedContentThumbnailMixin from '../mixins/curated-content-thumbnail';
import TrackClickMixin from '../mixins/track-click';
import IEIFrameFocusFixMixin from '../mixins/ieiframe-focus-fix';
import SearchImagesModel from '../models/search-images';

export default App.CuratedContentEditorImageSearchComponent = Ember.Component.extend(
	CuratedContentEditorLabelsMixin,
	CuratedContentEditorLayoutMixin,
	CuratedContentThumbnailMixin,
	TrackClickMixin,
	IEIFrameFocusFixMixin,
	{
		classNames: ['curated-content-editor-image-search'],
		debounceDuration: 300,
		spinnerOverlay: false,
		searchPlaceholder: Ember.computed(() =>
			i18n.t('app.curated-content-editor-search-images-placeholder')
		),

		searchQueryObserver: Ember.observer('searchQuery', function () {
			const searchQuery = this.get('searchQuery');

			this.set('imagesModel', SearchImagesModel.create({
				searchQuery
			}));

			if (!Ember.isEmpty(searchQuery)) {
				this.set('isLoading', true);

				Ember.run.debounce(this, this.getNextBatch, this.debounceDuration);
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
				this.setProperties({
					spinnerOverlay: true,
					isLoading: true,
				});
				this.getNextBatch();
			}
		},

		/**
		 * @returns {void}
		 */
		getNextBatch() {
			this.get('imagesModel').next()
				.catch((error) => {
					Ember.Logger.error(error);

					this.set('searchMessage', i18n.t('app.curated-content-editor-no-images-found'));
				})
				.finally(() => {
					this.setProperties({
						spinnerOverlay: false,
						isLoading: false,
					});
				});
		}
	}
);
