/// <reference path="../app.ts" />
/// <reference path="../mixins/CuratedContentEditorThumbnailMixin.ts"/>
/// <reference path="../mixins/LoadingSpinnerMixin.ts" />

'use strict';
App.CuratedContentEditorItemComponent = Em.Component.extend(App.CuratedContentEditorThumbnailMixin, App.LoadingSpinnerMixin, {
	classNames: ['curated-content-editor-item'],
	imageSize: 300,
	maxLabelLength: 48,
	throttleDuration: 250,
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


	labelObserver: Em.observer('model.title', function (): void {
			this.validateLabelThrottled();
		}
	),

	titleObserver: Em.observer('model.title', function (): void {
			this.validateTitleThrottled();
			this.getImageDebounced();
			this.showLoader();
		}
	),

	actions: {
		setLabelFocusedOut(): void {
			this.validateLabelThrottled();
			this.set('isLabelFocused', false);
		},

		setLabelFocusedIn(): void {
			this.validateLabelThrottled();
			this.set('isLabelFocused', true);
		},

		setTitleFocusedOut(): void {
			this.validateTitleThrottled();
			this.set('isTitleFocused', false);
		},

		setTitleFocusedIn(): void {
			this.validateTitleThrottled();
			this.set('isTitleFocused', true);
		},

		goBack(): void {
			this.sendAction('goBack');
		},

		done(): void {
			if (this.get('canSave')) {
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

	validateLabel(): void {
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
	},

	validateLabelThrottled(): void {
		Em.run.throttle(this, this.validateLabel, this.get('throttleDuration'));
	},

	validateTitle(): void {
		var title = this.get('model.title'),
			errorMessage: string = null;

		if (Em.isEmpty(title)) {
			//@TODO CONCF-956 add translations
			errorMessage = 'Title is empty';
		} else if (title.length > this.get('maxLabelLength')) {
			//@TODO CONCF-956 add translations
			errorMessage = 'Title is too long';
		}

		this.set('titleErrorMessage', errorMessage);
	},

	validateTitleThrottled(): void {
		Em.run.throttle(this, this.validateTitle, this.get('throttleDuration'));
	},

	getImage(): void {
		Em.$.ajax({
			url: M.buildUrl({
				path: '/wikia.php',
			}),
			data: {
				controller: 'CuratedContent',
				method: 'getImage',
				title: this.get('model.title'),
				size: this.get('imageSize'),
			},
			dataType: 'json',
			success: (data): void => {
				if (data.url === '') {
					this.set('imageErrorMessage', 'Please provide an image, as this item has no default.');
				} else {
					this.set('imageErrorMessage', null);
				}
				this.set('imageUrl', data.url);
			},
			error: (err: any): void => {
				this.set('imageErrorMessage', 'Oops! An API Error occured.');
			},
			complete: (): void => {
				this.hideLoader();
			}
		});
	},

	getImageDebounced(): void {
		Em.run.debounce(this, this.getImage, this.get('debounceDuration'));
	}
});
