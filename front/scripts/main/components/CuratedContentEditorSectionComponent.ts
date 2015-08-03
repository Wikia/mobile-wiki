/// <reference path="../app.ts" />
/// <reference path="../mixins/AlertNotificationsMixin.ts" />
/// <reference path="../mixins/CuratedContentEditorSortableItemsMixin.ts" />
/// <reference path="../mixins/CuratedContentEditorThumbnailMixin.ts" />
/// <reference path="../mixins/LoadingSpinnerMixin.ts" />
'use strict';

App.CuratedContentEditorSectionComponent = Em.Component.extend(
	App.AlertNotificationsMixin,
	App.CuratedContentEditorSortableItemsMixin,
	App.CuratedContentEditorThumbnailMixin,
	App.LoadingSpinnerMixin,
{
	imageSize: 300,
	thumbUrl: Em.computed('model', function (): string {
		return this.generateThumbUrl(this.get('model.image_url'));
	}),
	notEmptyItems: Em.computed.notEmpty('model.items'),

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
			if (this.get('notEmptyItems')) {
				this.validateAndDone();
			} else {
				//@TODO CONCF-956 add translations
				this.addAlert('alert', 'Sections can\'t be empty, please add items to section');
			}
		}
	},

	validateAndDone(): void {
		this.showLoader();
		App.CuratedContentEditorItemModel.validateSectionWithItems(this.get('model'))
			.then((data: CuratedContentValidationResponseInterface): void => {
				var sortableItems: any;

				if (data.status) {
					sortableItems = this.get('sortableItems
					// It's done this way because sortableItems property contains not only items but also meta properties
					// which we don't want to pass to model.
					// Slice creates native JS array with only items (without meta properties).
					this.set('model.items', sortableItems.slice(0, sortableItems.length));
					this.sendAction('done', this.get('model'));
				} else {
					data.error.forEach((error: any) => this.processValidationError(error.reason));
				}
			})
			.catch((): void => {
				//@TODO CONCF-956 add translations
				this.addAlert('alert', 'Something went wrong. Please repeat.');
			})
			.finally((): void => {
				this.hideLoader();
			});
	},

	processValidationError(reason: string) {
		switch (reason) {
			// errors that belong to item -> something went very wrong if we have those
			case 'articleNotFound':
			case 'emptyLabel':
			case 'tooLongLabel':
			case 'videoNotSupportProvider':
			case 'notSupportedType':
			case 'duplicatedLabel':
			case 'noCategoryInTag':
			case 'imageMissing':
				//@TODO CONCF-956 add translations
				this.addAlert('alert', 'Please fix errors inside items');
				break;
			case 'itemsMissing':
				//@TODO CONCF-956 add translations
				this.addAlert('alert', 'Sections can\'t be empty, please add items to section');
		}
	}
});
