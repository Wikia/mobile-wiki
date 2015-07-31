/// <reference path="../app.ts" />
/// <reference path="../mixins/AlertNotificationsMixin.ts" />
/// <reference path="../mixins/LoadingSpinnerMixin.ts" />
'use strict';

App.CuratedContentEditorSectionComponent = Em.Component.extend(App.CuratedContentEditorThumbnailMixin, App.AlertNotificationsMixin, {
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
			if (!this.get('notEmptyItems')) {
				//@TODO CONCF-956 add translations
				this.addAlert('alert', 'You need to add some items.');
			} else {
				this.showLoader();
				App.CuratedContentEditorItemModel.validateSection(this.get('model'))
					.then((data: CuratedContentValidationResponseInterface): void => {
						if (data.status) {
							//@TODO CONCF-956 add translations
							this.addAlert('info', 'Data validated.');
							this.sendAction('done', this.get('model'));
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
										this.addAlert('alert', 'You need to add some items.');
								}
							});
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
		}
	}
});
