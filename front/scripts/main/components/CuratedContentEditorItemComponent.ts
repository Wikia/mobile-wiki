/// <reference path="../app.ts" />
/// <reference path="../mixins/CuratedContentEditorThumbnailMixin.ts"/>
/// <reference path="../mixins/LoadingSpinnerMixin.ts" />

'use strict';
App.CuratedContentEditorItemComponent = Em.Component.extend(App.CuratedContentEditorThumbnailMixin, App.LoadingSpinnerMixin, {
	classNames: ['curated-content-editor-item'],
	imageSize: 300,
	maxLabelLength: 48,
	debounceDuration: 250,

	imageUrl: Em.computed('model', function (): string {
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
		}
	),

	titleObserver: Em.observer('model.title', function (): void {
			this.set('imageUrl', App.CuratedContentEditorThumbnailMixin.emptyGif);
			this.set('imageErrorMessage', null);

			if (this.validateTitle()) {
				this.getImageDebounced();
			}
		}
	),

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
		},

		setTitleFocusedIn(): void {
			this.validateTitle();
			this.set('isTitleFocused', true);
		},

		goBack(): void {
			this.sendAction('goBack');
		},

		done(): void {
			if (this.validateTitle() && this.validateLabel()) {
				this.sendAction('done', this.get('model'));
			}
		},

		deleteItem(): void {
			//@TODO CONCF-956 add translations
			if (confirm('Are you sure about removing this item?')) {
				this.sendAction('deleteItem');
			}
		}
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
			} else if (title.length > this.get('maxLabelLength')) {
				//@TODO CONCF-956 add translations
				errorMessage = 'Title is too long';
			}

			this.set('titleErrorMessage', errorMessage);

			return !errorMessage;
		} else {
			return true;
		}
	},

	getImage(): void {
		App.CuratedContentEditorItemModel
			.getImage(this.get('model.title'), this.get('imageSize'))
			.then((data: any): void => {
				if (data.url === '') {
					//@TODO CONCF-956 add translations
					this.set('imageErrorMessage', 'Please provide an image, as this item has no default.');
					this.set('imageUrl', App.CuratedContentEditorThumbnailMixin.emptyGif);
				} else {
					this.set('imageErrorMessage', null);
					this.set('imageUrl', data.url);
				}
			})
			.catch((): void => {
				//@TODO CONCF-956 add translations
				this.set('imageErrorMessage', 'Oops! An API Error occured.');
			})
			.finally((): void => {
				this.hideLoader();
			});
	},

	getImageDebounced(): void {
		this.showLoader();
		Em.run.debounce(this, this.getImage, this.get('debounceDuration'));
	}
});
