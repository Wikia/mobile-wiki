/// <reference path="../app.ts" />
///<reference path="../mixins/CuratedContentEditorThumbnailMixin.ts"/>

'use strict';
App.CuratedContentEditorItemComponent = Em.Component.extend(App.CuratedContentEditorThumbnailMixin, {
	classNames: ['curated-content-editor-item'],
	imageSize: 200,

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

	actions: {
		setLabelFocusedOut(): void {
			this.set('isLabelFocused', false);
		},

		setLabelFocusedIn(): void {
			this.set('isLabelFocused', true);
		},

		validateLabel(): void {
			var value = this.get('model.label'),
				otherItemLabels = this.get('otherItemLabels'),
				errorMessage: string = null;

			if (value.length === 0) {
				errorMessage = 'Label is empty';
			} else if (value.length > 48) {
				errorMessage = 'Label is too long';
			} else if (otherItemLabels.indexOf(value) !== -1) {
				errorMessage = 'Label is duplicated';
			}

			this.set('labelErrorMessage', errorMessage);
		},

		setTitleFocusedOut(): void {
			this.set('isTitleFocused', false);
		},

		setTitleFocusedIn(): void {
			this.set('isTitleFocused', true);
		},

		validateTitle(): void {
			var value = this.get('model.title'),
				errorMessage: string = null;

			if (value.length === 0) {
				errorMessage = 'Title is empty';
			} else if (value.length > 48) {
				errorMessage = 'Title is too long';
			}

			this.set('titleErrorMessage', errorMessage);
		},

		goBack(): void {
			this.sendAction('goBack');
		},

		done(): void {
			if (this.get('canSave')) {
				this.sendAction('updateItem', this.get('model'));
			}
		},

		deleteItem(): void {
			//@TODO CONCF-956 add translations
			if (confirm('Are you sure about removing this item?')) {
				this.sendAction('deleteItem');
			}
		}
	}
});
