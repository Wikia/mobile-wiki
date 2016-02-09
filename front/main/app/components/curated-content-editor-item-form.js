import Ember from 'ember';
import AlertNotificationsMixin from '../mixins/alert-notifications';
import CuratedContentEditorLabelsMixin from '../mixins/curated-content-editor-labels';
import CuratedContentEditorLayoutMixin from '../mixins/curated-content-editor-layout';
import CuratedContentThumbnailMixin from '../mixins/curated-content-thumbnail';
import TrackClickMixin from '../mixins/track-click';
import IEIFrameFocusFixMixin from '../mixins/ieiframe-focus-fix';
import ArticleAddPhotoModel from '../models/article-add-photo';
import CuratedContentEditorItemModel from '../models/curated-content-editor-item';

export default Ember.Component.extend(
	AlertNotificationsMixin,
	CuratedContentEditorLabelsMixin,
	CuratedContentEditorLayoutMixin,
	CuratedContentThumbnailMixin,
	TrackClickMixin,
	IEIFrameFocusFixMixin,
	{
		classNames: ['curated-content-editor-item'],
		imageWidth: 300,
		maxLabelLength: 48,
		debounceDuration: 250,
		imageMenuVisible: false,

		// Force one way binding
		model: Ember.computed.oneWay('attrs.model'),

		/* 16x9 transparent gif */
		emptyGif: 'data:image/gif;base64,R0lGODlhEAAJAIAAAP///////yH5BAEKAAEALAAAAAAQAAkAAAIKjI+py+0Po5yUFQA7',
		imageUrl: Ember.computed('model.image_url', 'model.image_crop', function () {
			if (this.get('model.image_url')) {
				const aspectRatioName = this.get('aspectRatioName'),
					imageCrop = this.get(`model.image_crop.${aspectRatioName}`) || null;

				return this.generateThumbUrl(this.get('model.image_url'), imageCrop);
			}
			return this.get('emptyGif');
		}),

		isSection: Ember.computed.equal('model.node_type', 'section'),

		isTooltipVisible: false,

		isTitleNotEmpty: Ember.computed.notEmpty('model.title'),
		isLabelNotEmpty: Ember.computed.notEmpty('model.label'),

		isTitleFocused: false,
		isLabelFocused: false,

		isTitleActive: Ember.computed.or('isTitleNotEmpty', 'isTitleFocused'),
		isLabelActive: Ember.computed.or('isLabelNotEmpty', 'isLabelFocused'),

		labelErrorMessage: null,
		titleErrorMessage: null,
		imageErrorMessage: null,

		canSave: Ember.computed('labelErrorMessage', 'titleErrorMessage', 'imageErrorMessage', function () {
			return Ember.isEmpty(this.get('labelErrorMessage')) &&
				Ember.isEmpty(this.get('titleErrorMessage')) &&
				Ember.isEmpty(this.get('imageErrorMessage'));
		}),

		errorClass: 'error',
		labelClass: Ember.computed.and('labelErrorMessage', 'errorClass'),
		titleClass: Ember.computed.and('titleErrorMessage', 'errorClass'),

		pageNameTooltip: Ember.computed('isCategory', function () {
			if (this.get('isCategory')) {
				return i18n.t('app.curated-content-editor-enter-category-name-tooltip');
			}
			return i18n.t('app.curated-content-editor-enter-page-name-tooltip');
		}),

		searchSuggestionsResult: [],
		/**
		 * messages used:
		 * app.curated-content-editor-no-articles-found
		 * app.curated-content-editor-suggestions-loading
		 */
		searchSuggestionsMessage: Ember.computed('suggestionsError', function () {
			if (this.get('suggestionsError')) {
				if (this.get('isCategory')) {
					return i18n.t('app.curated-content-editor-no-categories-found');
				}
				return i18n.t('app.curated-content-editor-no-articles-found');
			}
			return i18n.t('app.curated-content-editor-suggestions-loading');
		}),

		/**
		 * @returns {void}
		 */
		labelObserver() {
			this.validateLabel();
		},

		/**
		 * @returns {void}
		 */
		titleObserver() {
			const title = this.get('model.title');

			if (this.validateTitle()) {
				this.getImageDebounced();
			}

			if (this.get('isTitleFocused') && !Ember.isEmpty(title) && title.length > 2) {
				this.setProperties({
					searchSuggestionsResult: [],
					suggestionsError: false,
					searchSuggestionsVisible: true
				});

				this.setSearchSuggestionsDebounced();
			}
		},

		/**
		 * @returns {void}
		 */
		didRender() {
			// We don't want to fire observers when model changes from undefined to the actual one, so we add them here
			this.addObserver('model.title', this, this.titleObserver);
			this.addObserver('model.label', this, this.labelObserver);
		},

		/**
		 * When user taps/clicks anywhere we want to close search suggestions panel
		 *
		 * @returns {void}
		 */
		click() {
			this.set('searchSuggestionsVisible', false);
		},

		actions: {
			/**
			 * @returns {void}
			 */
			setLabelFocusedOut() {
				this.validateLabel();
				this.set('isLabelFocused', false);
			},

			/**
			 * @returns {void}
			 */
			setLabelFocusedIn() {
				this.set('isLabelFocused', true);
			},

			/**
			 * @returns {void}
			 */
			setTitleFocusedOut() {
				this.validateTitle();
				this.setProperties({
					isTitleFocused: false,
					isLoading: false,
				});
			},

			/**
			 * @returns {void}
			 */
			setTitleFocusedIn() {
				this.set('isTitleFocused', true);
			},

			/**
			 * @returns {void}
			 */
			goBack() {
				const trackLabel = this.get('isSection') ? 'section-edit-go-back' : 'item-edit-go-back';

				this.trackClick('curated-content-editor', trackLabel);
				this.sendAction('goBack');
			},

			/**
			 * @returns {void}
			 */
			done() {
				const trackLabel = this.get('isSection') ? 'section-edit-done' : 'item-edit-done';

				this.trackClick('curated-content-editor', trackLabel);
				if (this.validateTitle() && this.validateLabel() && this.validateImage()) {
					if (this.get('isSection')) {
						this.validateAndDone(this.get('model'), 'validateCuratedContentSection');
					} else if (this.get('isFeaturedItem')) {
						this.validateAndDone(this.get('model'), 'validateCuratedContentFeaturedItem');
					} else {
						this.validateAndDone(this.get('model'), 'validateCuratedContentSectionItem');
					}
				}
			},

			/**
			 * @returns {void}
			 */
			deleteItem() {
				const trackLabel = this.get('isSection') ? 'section-delete' : 'item-delete';

				this.trackClick('curated-content-editor', trackLabel);
				if (confirm(i18n.t('app.curated-content-editor-remove-item-confirmation'))) {
					this.sendAction('deleteItem');
				}
			},

			/**
			 * Uploads ONLY FIRST of the selected files (if multiple files are selected)
			 *
			 * @param {String[]} files
			 * @returns {void}
			 */
			fileUpload(files) {
				this.trackClick('curated-content-editor', 'item-file-upload');
				this.set('isLoading', true);

				ArticleAddPhotoModel.load(files[0])
					.then((photoModel) => ArticleAddPhotoModel.upload(photoModel))
					.then((data) => {
						if (data && data.url && data.article_id) {
							this.setProperties({
								'imageProperties.url': data.url,
								// article_id comes from MW because in MW files are like any other articles
								// so there is no such thing as image_id from MW perspective.
								'imageProperties.id': data.article_id,
								// Make cropper back button go back here
								'imageCropLayout.previous': this.get('itemFormLayout.name')
							});

							this.sendAction('changeLayout', this.get('imageCropLayout.name'));
						} else {
							Ember.Logger.error('Image Data Object is malformed. Url or article_id is missing');
							this.set('imageErrorMessage', i18n.t('app.curated-content-image-upload-error'));
						}
					})
					.catch((err) => {
						Ember.Logger.error(err);
						this.set('imageErrorMessage', i18n.t('app.curated-content-image-upload-error'));
					})
					.finally(() => {
						this.set('isLoading', false);
					});
			},

			/**
			 * @returns {void}
			 */
			showImageMenu() {
				this.trackClick('curated-content-editor', 'item-image-menu');
				this.set('imageMenuVisible', true);
			},

			/**
			 * @returns {void}
			 */
			hideImageMenu() {
				this.set('imageMenuVisible', false);
			},

			/**
			 * @returns {void}
			 */
			showSearchImageForm() {
				this.trackClick('curated-content-editor', 'item-image-search');
				this.sendAction('changeLayout', this.get('imageSearchLayout.name'));
			},

			/**
			 * @returns {void}
			 */
			cropImage() {
				this.setProperties({
					'imageProperties.url': this.get('model.image_url'),
					'imageProperties.id': this.get('model.image_id'),
					'imageCropLayout.previous': this.get('itemFormLayout.name')
				});
				this.trackClick('curated-content-editor', 'item-crop-image');
				this.sendAction('changeLayout', this.get('imageCropLayout.name'));
			},

			/**
			 * @param {string} title
			 * @returns {void}
			 */
			setTitle(title) {
				this.setProperties({
					'model.title': title,
					searchSuggestionsVisible: false
				});
			},

			/**
			 * @param {string} tooltipMessage
			 * @returns {void}
			 */
			showTooltip(tooltipMessage) {
				this.trackClick('curated-content-editor', 'tooltip-show');
				this.setProperties({
					tooltipMessage,
					isTooltipVisible: true
				});
			}
		},

		/**
		 * @returns {boolean}
		 */
		validateImage() {
			const imageUrl = this.get('model.image_url');
			let errorMessage = null;

			if (!imageUrl) {
				errorMessage = i18n.t('app.curated-content-editor-image-missing-error');
			}

			this.set('imageErrorMessage', errorMessage);

			return !errorMessage;
		},

		/**
		 * @returns {boolean}
		 */
		validateLabel() {
			const label = this.get('model.label'),
				alreadyUsedLabels = this.getWithDefault('alreadyUsedLabels', []);
			let errorMessage = null;

			if (Ember.isEmpty(label)) {
				errorMessage = 'app.curated-content-editor-missing-label-error';
			} else if (label.length > this.get('maxLabelLength')) {
				errorMessage = 'app.curated-content-editor-too-long-label-error';
			} else if (Array.isArray(alreadyUsedLabels) && alreadyUsedLabels.indexOf(label) !== -1) {
				errorMessage = 'app.curated-content-editor-label-in-use-error';
			}

			this.set('labelErrorMessage', i18n.t(errorMessage));

			return !errorMessage;
		},

		/**
		 * @returns {boolean} is title valid
		 */
		validateTitle() {
			let title,
				errorMessage = null;

			if (!this.get('isSection')) {
				title = this.get('model.title');

				if (Ember.isEmpty(title)) {
					errorMessage = this.get('isCategory') ?
						i18n.t('app.curated-content-editor-missing-category-title-error') :
						i18n.t('app.curated-content-editor-missing-page-title-error');
				}

				this.set('titleErrorMessage', errorMessage);

				return !errorMessage;
			}

			return true;
		},

		/**
		 * @returns {void}
		 */
		getImage() {
			CuratedContentEditorItemModel
				.getImage(this.get('model.title'), this.get('imageWidth'))
				.then((data) => {
					if (data.url) {
						this.setProperties({
							imageErrorMessage: null,
							resetFileInput: true,
							'model.image_url': data.url,
							'model.image_id': data.id,
							'model.image_crop': null
						});
					} else if (!this.get('model.image_url')) {
						this.set('imageErrorMessage', i18n.t('app.curated-content-editor-image-missing-error'));
					}
				})
				.catch((err) => {
					Ember.Logger.error(err);
					this.set('imageErrorMessage', i18n.t('app.curated-content-error-other'));
				})
				.finally(() => {
					this.set('isLoading', false);
				});
		},

		/**
		 * @returns {void}
		 */
		getImageDebounced() {
			this.set('isLoading', true);
			Ember.run.debounce(this, this.getImage, this.get('debounceDuration'));
		},

		/**
		 * @param {CuratedContentEditorItemModel} item
		 * @param {string} methodName
		 * @returns {void}
		 */
		validateAndDone(item, methodName) {
			this.set('isLoading', true);

			CuratedContentEditorItemModel.validateServerData(item, methodName)
				.then((data) => {
					if (data.status) {
						this.sendAction('done', this.get('model'));
					} else if (Ember.isArray(data.errors)) {
						data.errors.forEach((error) => this.processValidationError(error));
					} else {
						this.addAlert({
							message: i18n.t('app.curated-content-error-other'),
							type: 'alert'
						});
					}
				})
				.catch((err) => {
					Ember.Logger.error(err);
					this.addAlert({
						message: i18n.t('app.curated-content-error-other'),
						type: 'alert'
					});
				})
				.finally(() => {
					this.set('isLoading', false);
				});
		},

		/**
		 * @param {string} errorMessage
		 * @returns {void}
		 */
		processValidationError(errorMessage) {
			switch (errorMessage) {
			case 'articleNotFound':
				this.set('titleErrorMessage', i18n.t('app.curated-content-editor-article-not-found-error'));
				break;
			case 'emptyLabel':
			case 'tooLongLabel':
				// error should be displayed with validateLabel method - no need to duplicate messages
				this.validateLabel();
				break;
			case 'videoNotSupportProvider':
				this.set('titleErrorMessage', i18n.t('app.curated-content-editor-video-provider-not-supported-error'));
				break;
			case 'notSupportedType':
				this.set('titleErrorMessage', i18n.t('app.curated-content-editor-unsupported-page-type-error'));
				break;
			case 'duplicatedLabel':
				this.set('labelErrorMessage', i18n.t('app.curated-content-editor-label-in-use-error'));
				break;
			case 'noCategoryInTag':
				this.set('titleErrorMessage', i18n.t('app.curated-content-editor-only-categories-supported-error'));
				break;
			case 'imageMissing':
				this.set('imageErrorMessage', i18n.t('app.curated-content-editor-image-missing-error'));
				break;
			default:
				// none
			}
		},

		/**
		 * @returns {void}
		 */
		setSearchSuggestionsDebounced() {
			Ember.run.debounce(this, this.setSearchSuggestions, this.debounceDuration);
		},

		/**
		 * @returns {void}
		 */
		setSearchSuggestions() {
			const title = this.get('model.title');

			CuratedContentEditorItemModel.getSearchSuggestions(title, this.get('isCategory'))
				.then((data) => {
					this.set('searchSuggestionsResult', data.items);
				})
				.catch((error) => {
					// 404 error is returned when no articles were found. No need to log it
					if (error && error.status !== 404) {
						Ember.Logger.error(error);
					}

					this.setProperties({
						suggestionsError: true,
						searchSuggestionsResult: []
					});
				});
		}
	}
);
