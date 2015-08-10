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
	imageWidth: 300,
	imageHeight: 300,

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
		App.CuratedContentEditorItemModel.validateServerData(this.get('model'), {
				method: 'validateSectionWithItems',
			})
			.then((data: CuratedContentValidationResponseInterface): void => {
				var sortableItems: any;

				if (data.status) {
					sortableItems = this.get('sortableItems');
					// It's done this way because sortableItems property contains not only items but also meta properties
					// which we don't want to pass to model.
					// Slice creates native JS array with only items (without meta properties).
					this.set('model.items', sortableItems.slice(0, sortableItems.length));
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
				Em.Logger.error(err);
				//@TODO CONCF-956 add translations
				this.addAlert('alert', 'Something went wrong. Please repeat.');
			})
			.finally((): void => this.hideLoader());
	},

	processValidationError(reason: string) {
		if (reason === 'itemsMissing') {
			//@TODO CONCF-956 add translations
			this.addAlert('alert', 'Sections can\'t be empty, please add items to section');
		} else {
			// if other items occur that means user somehow bypassed validation of one or more items earlier
			//@TODO CONCF-956 add translations
			this.addAlert('alert', 'Please fix errors inside items');
		}
	}
});
