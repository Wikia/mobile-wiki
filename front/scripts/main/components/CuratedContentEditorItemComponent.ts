/// <reference path="../app.ts" />
'use strict';
App.CuratedContentEditorItemComponent = Em.Component.extend({
	classNames: ['curated-content-editor-item'],
	emptyGif: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
	cropMode: Mercury.Modules.Thumbnailer.mode.topCrop,
	thumbnailer: Mercury.Modules.Thumbnailer,
	imageSize: 200,

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

	actions: {
		setLabelFocusedOut(): void {
			this.set('isLabelFocused', false);
		},

		setLabelFocusedIn(): void {
			this.set('isLabelFocused', true);
		},

		setTitleFocusedOut(): void {
			this.set('isTitleFocused', false);
		},

		setTitleFocusedIn(): void {
			this.set('isTitleFocused', true);
		},

		goBack(): void {
			this.sendAction('goBack');
		},

		updateItem(): void {
			this.sendAction('updateItem', this.get('model'));
		},

		deleteItem(): void {
			if (confirm('Are you sure about removing this item?')) {
				this.sendAction('deleteItem');
			}
		}
	}
});
