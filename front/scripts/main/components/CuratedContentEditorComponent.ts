/// <reference path="../app.ts" />
/// <reference path="../mixins/AlertNotificationsMixin.ts" />
/// <reference path="../mixins/LoadingSpinnerMixin.ts" />
/// <reference path="../mixins/TrackClickMixin.ts"/>
'use strict';

App.CuratedContentEditorComponent = Em.Component.extend(
	App.AlertNotificationsMixin,
	App.LoadingSpinnerMixin,
	App.TrackClickMixin,
{
	classNames: ['curated-content-editor'],

	actions: {
		addBlockItem(block: string): void {
			this.sendAction('addBlockItem', block);
		},

		addSection(): void {
			this.sendAction('addSection');
		},

		editBlockItem(item: CuratedContentEditorItemModel, block: string): void {
			this.sendAction('editBlockItem', item, block);
		},

		openSection(item: CuratedContentEditorItemModel): void {
			this.sendAction('openSection', item);
		},

		save(): void {
			this.trackClick('curated-content-editor', 'save');
			this.validateAndSave();
		}
	},

	validateAndSave(): void {
		this.showLoader();
		App.CuratedContentEditorModel.save(this.get('model'))
			.then((data: CuratedContentValidationResponseInterface): void => {
				if (data.status) {
					this.addAlert({
						message: i18n.t('app.curated-content-editor-changes-saved'),
						type: 'info'
					});
					this.sendAction('openMainPage');
				} else {
					if (data.error) {
						data.error.forEach((error: any) => this.processValidationError(error.reason));
					} else {
						this.addAlert({
							message: i18n.t('app.curated-content-error-other'),
							type: 'alert'
						});
					}
				}
			})
			.catch((err: any): void => {
				if (err.status === 403) {
					this.addAlert({
						message: i18n.t('app.curated-content-editor-error-no-save-permissions'),
						type: 'warning'
					});
				} else {
					Em.Logger.error(err);
					this.addAlert({
						message: i18n.t('app.curated-content-error-other'),
						type: 'alert'
					});
				}
			})
			.finally((): void => this.hideLoader());
	},

	processValidationError(reason: string) {
		if (reason === 'itemsMissing') {
			this.addAlert({
				message: i18n.t('app.curated-content-editor-missing-items-error'),
				type: 'alert'
			});
		} else {
			// if other items occur that means user somehow bypassed validation of one or more items earlier
			this.addAlert({
				message: i18n.t('app.curated-content-editor-error-inside-items-message'),
				type: 'alert'
			});
		}
	}
});
