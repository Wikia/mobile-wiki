/// <reference path="../app.ts" />
'use strict';
App.CuratedContentEditorItemComponent = Em.Component.extend({
	classNames: ['curated-content-editor-item'],
	emptyGif: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
	cropMode: Mercury.Modules.Thumbnailer.mode.topCrop,
	thumbnailer: Mercury.Modules.Thumbnailer,
	imageSize: 300,
	throttleDuration: 250,
	debounceDuration: 250,

	imageUrl: Em.computed('model', function (): string {
		var model: CuratedContentEditorItemInterface = this.get('model'),
			options: any = {
				width: this.get('imageSize'),
				height: this.get('imageSize'),
				mode: this.get('cropMode')
			};

		return !Em.isEmpty(model.image_url) ? this.thumbnailer.getThumbURL(model.image_url, options) : this.emptyGif;
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

	getLabelClasses: Em.computed('labelErrorMessage', function (): string {
			return Em.isEmpty(this.get('labelErrorMessage')) ? '' : 'error'
		}
	),
	getTitleClasses: Em.computed('titleErrorMessage', function (): string {
			return Em.isEmpty(this.get('titleErrorMessage')) ? '' : 'error'
		}
	),

	actions: {
		setLabelFocusedOut (): void {
			this.set('isLabelFocused', false);
		},

		setLabelFocusedIn (): void {
			this.set('isLabelFocused', true);
		},

		labelInputEventHandler (): void {
			Em.run.throttle(this, this.validateLabel, this.get('throttleDuration'));
		},

		setTitleFocusedOut (): void {
			this.set('isTitleFocused', false);
		},

		setTitleFocusedIn (): void {
			this.set('isTitleFocused', true);
		},

		titleInputEventHandler (): void {
			Em.run.throttle(this, this.validateTitle, this.get('throttleDuration'));
			Em.run.debounce(this, this.getImage, this.get('debounceDuration'));
		},

		goBack (): void {
			this.sendAction('goBack');
		},

		updateItem (): void {
			if (this.get('canSave')) {
				this.sendAction('updateItem', this.get('model'));
			}
		},

		deleteItem (): void {
			if (confirm('Are you sure about removing this item?')) {
				this.sendAction('deleteItem');
			}
		}
	},

	validateLabel (): void {
		var value = this.get('model.label'),
			errorMessage: string = null;

		if (value.length === 0) {
			errorMessage = 'Label is empty';
		}
		else if (value.length > 48) {
			errorMessage = 'Label is too long';
		}

		this.set('labelErrorMessage', errorMessage);
	},

	validateTitle (): void {
		var value = this.get('model.title'),
			errorMessage: string = null;

		if (value.length === 0) {
			errorMessage = 'Title is empty';
		}
		else if (value.length > 48) {
			errorMessage = 'Title is too long';
		}

		this.set('titleErrorMessage', errorMessage);
	},

	getImage (): void {
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
			}
		});
	}
});
