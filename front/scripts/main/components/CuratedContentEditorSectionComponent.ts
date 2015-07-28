/// <reference path="../app.ts" />
///<reference path="../mixins/CuratedContentEditorThumbnailMixin.ts"/>
'use strict';

App.CuratedContentEditorSectionComponent = Em.Component.extend(App.CuratedContentEditorThumbnailMixin, {
	imageSize: 300,

	thumbUrl: Em.computed('model', function (): string {
		return this.generateThumbUrl(this.get('model.image_url'));
	}),

	notEmptyItems: Em.computed.notEmpty('model.items'),

	canSave: Em.computed('notEmptyItems', function (): boolean {
			return this.get('notEmptyItems');
		}
	),

	validateItems(): boolean {
		return this.get('notEmptyItems');
	},

	actions: {
		addItem(): void {
			this.sendAction('addItem');
		},

		editItem(item: CuratedContentEditorItemModel): void {
			this.sendAction('editItem', item);
		},

		editSection(): void {
			this.sendAction('editSection', this.get('model'));
		},

		goBack(): void {
			this.sendAction('goBack');
		},

		done(): void {
			if (this.validateItems()) {
				this.sendAction('done', this.get('model'));
			}
		}
	}
});
