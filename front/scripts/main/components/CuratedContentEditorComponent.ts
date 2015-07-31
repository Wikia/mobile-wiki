/// <reference path="../app.ts" />
/// <reference path="../mixins/AlertNotificationsMixin.ts" />
/// <reference path="../mixins/LoadingSpinnerMixin.ts" />
'use strict';

App.CuratedContentEditorComponent = Em.Component.extend(
	App.AlertNotificationsMixin,
	App.LoadingSpinnerMixin,
	{
	classNames: ['curated-content-editor'],

	actions: {
		addBlockItem(block: string): void {
			this.sendAction('addBlockItem', block);
		},

		editBlockItem(item: CuratedContentEditorItemModel, block: string): void {
			this.sendAction('editBlockItem', item, block);
		},

		addSection(): void {
			this.sendAction('addSection');
		},

		openSection(item: CuratedContentEditorItemModel): void {
			this.sendAction('openSection', item);
		},

		save(): void {
			this.validateAndSave();
		}
	},

	validateAndSave(): void {
		this.showLoader();
		App.CuratedContentEditorModel.save(this.get('model'))
			.then((data: CuratedContentValidationResponseInterface): void => {
				if (data.status) {
					//@TODO CONCF-956 add translations
					this.addAlert('info', 'Data validated.');
					this.sendAction('openMainPage');
				} else {
					data.error.forEach((error: any) => {
						switch(error.reason) {
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
								this.addAlert('alert', 'Please fix errors inside items.');
								break;
							case 'itemsMissing':
								//@TODO CONCF-956 add translations
								this.addAlert('alert', 'Please fix errors inside Explore the Wiki section.');
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
