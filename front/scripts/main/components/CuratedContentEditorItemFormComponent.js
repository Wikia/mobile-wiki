App.CuratedContentEditorItemFormComponent = Em.Component.extend(
	App.AlertNotificationsMixin,
	App.CuratedContentEditorLabelsMixin,
	App.CuratedContentEditorLayoutMixin,
	App.CuratedContentThumbnailMixin,
	App.LoadingSpinnerMixin,
	App.TrackClickMixin,
	App.IEIFrameFocusFixMixin,
	{
		classNames: ['curated-content-editor-item'],
		imageWidth: 300,
		maxLabelLength: 48,
		debounceDuration: 250,
		imageMenuVisible: false,

		// Force one way binding
		model: Em.computed.oneWay('attrs.model'),

		/* 16x9 transparent gif */
		emptyGif: 'data:image/gif;base64,R0lGODlhEAAJAIAAAP///////yH5BAEKAAEALAAAAAAQAAkAAAIKjI+py+0Po5yUFQA7',
		imageUrl: Em.computed('model.image_url', 'model.image_crop', function() {
			if (this.get('model.image_url')) {
				const aspectRatioName = this.get('aspectRatioName'),
					imageCrop = this.get(`model.image_crop.${aspectRatioName}`) || null;

				return this.generateThumbUrl(this.get('model.image_url'), imageCrop);
			}
			return this.get('emptyGif');
		}),

		isSection: Em.computed.equal('model.node_type', 'section'),

		isTooltipVisible: false,

		isTitleNotEmpty: Em.computed.notEmpty('model.title'),
		isLabelNotEmpty: Em.computed.notEmpty('model.label'),

		isTitleFocused: false,
		isLabelFocused: false,

		isTitleActive: Em.computed.or('isTitleNotEmpty', 'isTitleFocused'),
		isLabelActive: Em.computed.or('isLabelNotEmpty', 'isLabelFocused'),

		labelErrorMessage: null,
		titleErrorMessage: null,
		imageErrorMessage: null,

		canSave: Em.computed('labelErrorMessage', 'titleErrorMessage', 'imageErrorMessage', function() {
			return Em.isEmpty(this.get('labelErrorMessage')) &&
				Em.isEmpty(this.get('titleErrorMessage')) &&
				Em.isEmpty(this.get('imageErrorMessage'));
		}),

		errorClass: 'error',
		labelClass: Em.computed.and('labelErrorMessage', 'errorClass'),
		titleClass: Em.computed.and('titleErrorMessage', 'errorClass'),

		pageNameTooltip: Em.computed('isCategory', function() {
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
		searchSuggestionsMessage: Em.computed('suggestionsError', function() {
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

			if (this.get('isTitleFocused') && !Em.isEmpty(title) && title.length > 2) {
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
				this.set('isTitleFocused', false);
				if (this.get('isLoading')) {
					this.hideLoader();
				}
			},

			/**
			 * @returns {void}
			 */
			setTitleFocusedIn() {
				this.showLoader();
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
						this.validateAndDone(this.get('model'), {
							method: 'validateSection'
						});
					} else {
						this.validateAndDone(this.get('model'), {
							method: 'validateItem',
							isFeaturedItem: this.get('isFeaturedItem')
						});
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
				this.showLoader();
				App.ArticleAddPhotoModel.load(files[0])
					.then((photoModel) => App.ArticleAddPhotoModel.upload(photoModel))
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
							Em.Logger.error('Image Data Object is malformed. Url or article_id is missing');
							this.set('imageErrorMessage', i18n.t('app.curated-content-image-upload-error'));
						}
					})
					.catch((err) => {
						Em.Logger.error(err);
						this.set('imageErrorMessage', i18n.t('app.curated-content-image-upload-error'));
					})
					.finally(() => {
						this.hideLoader();
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
				this.trackClick('curated-content-editor', 'item-crop-image');
				this.set('imageCropLayout.previous', this.get('itemFormLayout.name'));
				this.sendAction('changeLayout', this.get('imageCropLayout.name'));
			},

			/**
			 * @param {String} title
			 * @returns {void}
			 */
			setTitle(title) {
				this.setProperties({
					'model.title': title,
					searchSuggestionsVisible: false
				});
			},

			/**
			 * @param {String} tooltipMessage
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
		 * @returns {void}
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
		 * @returns {void}
		 */
		validateLabel() {
			const label = this.get('model.label'),
				alreadyUsedLabels = this.get('alreadyUsedLabels');
			let errorMessage = null;

			if (Em.isEmpty(label)) {
				errorMessage = 'app.curated-content-editor-missing-label-error';
			} else if (label.length > this.get('maxLabelLength')) {
				errorMessage = 'app.curated-content-editor-too-long-label-error';
			} else if (alreadyUsedLabels.indexOf(label) !== -1) {
				errorMessage = 'app.curated-content-editor-label-in-use-error';
			}

			this.set('labelErrorMessage', i18n.t(errorMessage));

			return !errorMessage;
		},

		/**
		 * @returns {void}
		 */
		validateTitle() {
			let title,
				errorMessage = null;

			if (!this.get('isSection')) {
				title = this.get('model.title');

				if (Em.isEmpty(title)) {
					if (this.get('isCategory')) {
						errorMessage = i18n.t('app.curated-content-editor-missing-category-title-error');
					} else {
						errorMessage = i18n.t('app.curated-content-editor-missing-page-title-error');
					}
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
			App.CuratedContentEditorItemModel
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
					Em.Logger.error(err);
					this.set('imageErrorMessage', i18n.t('app.curated-content-error-other'));
				})
				.finally(() => this.hideLoader());
		},

		/**
		 * @returns {void}
		 */
		getImageDebounced() {
			this.showLoader();
			Em.run.debounce(this, this.getImage, this.get('debounceDuration'));
		},

		/**
		 * @param {CuratedContentEditorItemModel} item
		 * @param {Object} dataToValidate
		 * @returns {void}
		 */
		validateAndDone(item, dataToValidate) {
			this.showLoader();
			App.CuratedContentEditorItemModel.validateServerData(item, dataToValidate)
				.then((data) => {
					if (data.status) {
						this.sendAction('done', this.get('model'));
					} if (data.error) {
						data.error.forEach((error) => this.processValidationError(error.reason));
					} else {
						this.addAlert({
							message: i18n.t('app.curated-content-error-other'),
							type: 'alert'
						});
					}
				})
				.catch((err) => {
					Em.Logger.error(err);
					this.addAlert({
						message: i18n.t('app.curated-content-error-other'),
						type: 'alert'
					});
				})
				.finally(() => this.hideLoader());
		},

		/**
		 * @param {String} reason
		 * @returns {void}
		 */
		processValidationError(reason) {
			switch (reason) {
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
			Em.run.debounce(this, this.setSearchSuggestions, this.debounceDuration);
		},

		/**
		 * @returns {void}
		 */
		setSearchSuggestions() {
			const title = this.get('model.title');

			App.CuratedContentEditorItemModel.getSearchSuggestions(title)
				.then((data) => {
					this.set('searchSuggestionsResult', data.items);
				})
				.catch((error) => {
					// 404 error is returned when no articles were found. No need to log it
					if (error && error.status !== 404) {
						Em.Logger.error(error);
					}

					this.setProperties({
						suggestionsError: true,
						searchSuggestionsResult: []
					});
				});
		}
	}
);
