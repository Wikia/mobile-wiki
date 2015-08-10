/// <reference path="../app.ts" />
/// <reference path="../mixins/AlertNotificationsMixin.ts" />
/// <reference path="../mixins/CuratedContentEditorThumbnailMixin.ts"/>
/// <reference path="../mixins/LoadingSpinnerMixin.ts" />
'use strict';

App.CuratedContentEditorItemComponent = Em.Component.extend(
	App.AlertNotificationsMixin,
	App.CuratedContentEditorThumbnailMixin,
	App.LoadingSpinnerMixin,
	App.TrackClickMixin,
{
	classNames: ['curated-content-editor-item'],
	imageSize: 300,
	maxLabelLength: 48,
	debounceDuration: 250,

	imageUrl: Em.computed('model.image_url', function (): string {
		return this.generateThumbUrl(this.get('model.image_url'));
	}),

	isSectionView: Em.computed.equal('model.node_type', 'section'),

	isTitleNotEmpty: Em.computed.notEmpty('model.title'),
	isLabelNotEmpty: Em.computed.notEmpty('model.label'),

	isTitleFocused: false,
	isLabelFocused: false,

	isTitleActive: Em.computed.or('isTitleNotEmpty', 'isTitleFocused'),
	isLabelActive: Em.computed.or('isLabelNotEmpty', 'isLabelFocused'),

	labelErrorMessage: null,
	titleErrorMessage: null,
	imageErrorMessage: null,

	canSave: Em.computed('labelErrorMessage', 'titleErrorMessage', 'imageErrorMessage', function (): boolean {
			return Em.isEmpty(this.get('labelErrorMessage')) &&
				Em.isEmpty(this.get('titleErrorMessage')) &&
				Em.isEmpty(this.get('imageErrorMessage'));
		}
	),

	errorClass: 'error',
	labelClass: Em.computed.and('labelErrorMessage', 'errorClass'),
	titleClass: Em.computed.and('titleErrorMessage', 'errorClass'),

	labelObserver(): void {
		this.validateLabel();
	},

	titleObserver(): void {
		if (this.validateTitle()) {
			this.getImageDebounced();
		}
	},

	didRender(): void {
		// We don't want to fire observers when model changes from undefined to the actual one, so we add them here
		this.addObserver('model.title', this, this.titleObserver);
		this.addObserver('model.label', this, this.labelObserver);
	},

	actions: {
		setLabelFocusedOut(): void {
			this.validateLabel();
			this.set('isLabelFocused', false);
		},

		setLabelFocusedIn(): void {
			this.set('isLabelFocused', true);
		},

		setTitleFocusedOut(): void {
			this.validateTitle();
			this.set('isTitleFocused', false);
			if (this.get('isLoading')) {
				this.hideLoader();
			}
		},

		setTitleFocusedIn(): void {
			this.showLoader();
			this.set('isTitleFocused', true);
		},

		goBack(): void {
			this.trackClick('curated-content-editor', 'item-go-back');
			this.sendAction('goBack');
		},

		done(): void {
			this.trackClick('curated-content-editor', 'item-done');
			if (this.validateTitle() && this.validateLabel() && this.validateImage()) {
				if (this.get('isSectionView')) {
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

		deleteItem(): void {
			this.trackClick('curated-content-editor', 'item-delete');
			//@TODO CONCF-956 add translations
			if (confirm('Are you sure about removing this item?')) {
				this.sendAction('deleteItem');
			}
		},

		fileUpload(files: any[]): void {
			this.trackClick('curated-content-editor', 'item-file-upload');
			this.showLoader();
			App.AddPhotoModel.load(files[0])
				.then((photoModel: typeof App.AddPhotoModel) => App.AddPhotoModel.upload(photoModel))
				.then((data: any) => {
					if (data && data.url && data.article_id) {
						this.setProperties({
							'model.image_url': this.generateThumbUrl(data.url),
							// article_id comes from MW because in MW files are like any other articles
							// so there is no such thing as image_id from MW perspective.
							'model.image_id': data.article_id,
							'imageErrorMessage': null
						});
					} else {
						Em.Logger.error('Image Data Object is malformed. Url or article_id is missing');
						this.set('imageErrorMessage', i18n.t('app.curated-content-image-upload-error'));
					}
				})
				.catch((err: any) => {
					Em.Logger.error(err);
					this.set('imageErrorMessage', i18n.t('app.curated-content-image-upload-error'));
				})
				.finally(() => {
					this.hideLoader();
				});
		}
	},

	validateImage(): boolean {
		var imageUrl = this.get('model.image_url'),
			errorMessage: string = null;

		if (!imageUrl) {
			//@TODO CONCF-956 add translations
			errorMessage = 'Image is empty';
		}

		this.set('imageErrorMessage', errorMessage);

		return !errorMessage;
	},

	validateLabel(): boolean {
		var label = this.get('model.label'),
			alreadyUsedLabels = this.get('alreadyUsedLabels'),
			errorMessage: string = null;

		if (Em.isEmpty(label)) {
			//@TODO CONCF-956 add translations
			errorMessage = 'Label is empty';
		} else if (label.length > this.get('maxLabelLength')) {
			//@TODO CONCF-956 add translations
			errorMessage = 'Label is too long';
		} else if (alreadyUsedLabels.indexOf(label) !== -1) {
			//@TODO CONCF-956 add translations
			errorMessage = 'Label is duplicated';
		}

		this.set('labelErrorMessage', errorMessage);

		return !errorMessage;
	},

	validateTitle(): boolean {
		var title: string,
			errorMessage: string = null;

		if (!this.get('isSectionView')) {
			title = this.get('model.title');

			if (Em.isEmpty(title)) {
				//@TODO CONCF-956 add translations
				errorMessage = 'Title is empty';
			}

			this.set('titleErrorMessage', errorMessage);

			return !errorMessage;
		}

		return true;
	},

	getImage(): void {
		App.CuratedContentEditorItemModel
			.getImage(this.get('model.title'), this.get('imageSize'))
			.then((data: CuratedContentGetImageResponse): void => {
				if (!data.url) {
					if (!this.get('model.image_url')) {
						//@TODO CONCF-956 add translations
						this.set('imageErrorMessage', 'Please provide an image, as this item has no default.');
					}
				} else {
					this.setProperties({
						'imageErrorMessage': null,
						'model.image_url': data.url,
						'model.image_id': data.id
					});
					this.set('resetFileInput', true);
				}
			})
			.catch((err: any): void => {
				Em.Logger.error(err);
				//@TODO CONCF-956 add translations
				this.set('imageErrorMessage', 'Oops! An API Error occured.');
			})
			.finally((): void => this.hideLoader());
	},

	getImageDebounced(): void {
		this.showLoader();
		Em.run.debounce(this, this.getImage, this.get('debounceDuration'));
	},

	validateAndDone(item: CuratedContentEditorItemModel, data: any): void {
		this.showLoader();
		App.CuratedContentEditorItemModel.validateServerData(item, data)
			.then((data: CuratedContentValidationResponseInterface): void => {
				if (data.status) {
					this.sendAction('done', this.get('model'));
				} else {
					if (data.error) {
						data.error.forEach((error: any) => this.processValidationError(error.reason));
					} else {
						//@TODO CONCF-956 add translations
						this.addAlert('alert', 'Something went wrong. Please repeat.');
					}
				}
			})
			.catch((err: any): void => {
				//@TODO CONCF-956 add translations
				Em.Logger.error(err);
				this.addAlert('alert', 'Something went wrong. Please repeat.');
			})
			.finally((): void => this.hideLoader());
	},

	processValidationError(reason: string) {
		switch (reason) {
			case 'articleNotFound':
				//@TODO CONCF-956 add translations
				this.set('titleErrorMessage', 'Article not found.');
				break;
			case 'emptyLabel':
			case 'tooLongLabel':
				// error should be displayed with validateLabel method - no need to duplicate messages
				this.validateLabel();
				break;
			case 'videoNotSupportProvider':
				//@TODO CONCF-956 add translations
				this.set('titleErrorMessage', 'This video provider is not supported.');
				break;
			case 'notSupportedType':
				//@TODO CONCF-956 add translations
				this.set('titleErrorMessage', 'This type is not supported');
				break;
			case 'duplicatedLabel':
				//@TODO CONCF-956 add translations
				this.set('labelErrorMessage', 'Label is already used elsewhere.');
				break;
			case 'noCategoryInTag':
				//@TODO CONCF-956 add translations
				this.set('titleErrorMessage', 'Only Categories are accepted.');
				break;
			case 'imageMissing':
				//@TODO CONCF-956 add translations
				this.set('imageErrorMessage', 'Image is missing');
				break;
		}
	}
});
