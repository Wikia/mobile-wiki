/// <reference path="../app.ts" />
/// <reference path="../mixins/AlertNotificationsMixin.ts" />
/// <reference path="../mixins/CuratedContentEditorThumbnailMixin.ts"/>
/// <reference path="../mixins/LoadingSpinnerMixin.ts" />
'use strict';

App.CuratedContentEditorItemComponent = Em.Component.extend(
	App.AlertNotificationsMixin,
	App.CuratedContentEditorThumbnailMixin,
	App.LoadingSpinnerMixin,
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

	labelObserver: Em.observer('model.label', function (): void {
		this.validateLabel();
	}),

	titleObserver: Em.observer('model.title', function (): void {
		if (this.validateTitle()) {
			this.getImageDebounced();
		}
	}),

	actions: {
		setLabelFocusedOut(): void {
			this.validateLabel();
			this.set('isLabelFocused', false);
		},

		setLabelFocusedIn(): void {
			this.validateLabel();
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
			this.validateTitle();
			this.set('isTitleFocused', true);
		},

		goBack(): void {
			this.sendAction('goBack');
		},

		done(): void {
			if (this.validateTitle() && this.validateLabel() && this.validateImage()) {
				this.validateAndDone();
			}
		},

		deleteItem(): void {
			//@TODO CONCF-956 add translations
			if (confirm('Are you sure about removing this item?')) {
				this.sendAction('deleteItem');
			}
		}
	},

	validateImage(): boolean {
		var imageId = this.get('model.image_id'),
			errorMessage: string = null;

		if (!imageId) {
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
				}
			})
			.catch((err: any): void => {
				//@TODO CONCF-956 add translations
				Em.Logger.error(err);
				this.set('imageErrorMessage', 'Oops! An API Error occured.');
			})
			.finally((): void => {
				this.hideLoader();
			});
	},

	getImageDebounced(): void {
		this.showLoader();
		Em.run.debounce(this, this.getImage, this.get('debounceDuration'));
	},

	validateAndDone(): void {
		this.showLoader();
		App.CuratedContentEditorItemModel.validateItem(this.get('model'), false)
			.then((data: CuratedContentValidationResponseInterface): void => {
				if (data.status) {
					//@TODO CONCF-956 add translations
					this.addAlert('info', 'Data validated.');
					this.sendAction('done', this.get('model'));
				} else {
					data.error.forEach((error: any) => {
						switch(error.reason) {
							case 'articleNotFound':
								//@TODO CONCF-956 add translations
								this.set('titleErrorMessage', 'Article not found.');
								break;
							case 'emptyLabel':
							case 'tooLongLabel':
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
					});
					//@TODO CONCF-956 add translations
					this.addAlert('alert', 'Please fix errors.');
				}
			})
			.catch((): void => {
				//@TODO CONCF-956 add translations
				this.addAlert('alert', 'Something went wrong. Please repeat.');
			})
			.finally(():void => {
				this.hideLoader();
			});
	}
});
