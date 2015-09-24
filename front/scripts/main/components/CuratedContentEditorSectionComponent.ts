/// <reference path="../app.ts" />
/// <reference path="../mixins/AlertNotificationsMixin.ts" />
/// <reference path="../mixins/CuratedContentEditorSortableItemsMixin.ts" />
/// <reference path="../mixins/CuratedContentThumbnailMixin.ts" />
/// <reference path="../mixins/CuratedContentEditorLabelsMixin.ts" />
/// <reference path="../mixins/LoadingSpinnerMixin.ts" />
/// <reference path="../mixins/TrackClickMixin.ts"/>
'use strict';

App.CuratedContentEditorSectionComponent = Em.Component.extend(
	App.AlertNotificationsMixin,
	App.CuratedContentEditorSortableItemsMixin,
	App.CuratedContentThumbnailMixin,
	App.CuratedContentEditorLabelsMixin,
	App.LoadingSpinnerMixin,
	App.TrackClickMixin,
{
	imageWidth: 300,
	thumbUrl: Em.computed('model', function (): string {
		return this.generateThumbUrl(this.get('model.image_url'));
	}),
	notEmptyItems: Em.computed.notEmpty('model.items'),

	actions: {
		addItem(): void {
			this.trackClick('curated-content-editor', 'section-item-add');
			this.sendAction('addItem');
		},

		editItem(item: CuratedContentEditorItemModel): void {
			this.trackClick('curated-content-editor', 'section-item-edit');
			this.sendAction('editItem', item);
		},

		editSection(): void {
			this.trackClick('curated-content-editor', 'section-edit');
			this.sendAction('editSection', this.get('model'));
		},

		goBack(): void {
			this.trackClick('curated-content-editor', 'section-go-back');
			this.sendAction('goBack');
		},

		done(): void {
			this.trackClick('curated-content-editor', 'section-done');
			if (this.get('notEmptyItems')) {
				this.validateAndDone();
			} else {
				this.addAlert({
					message: i18n.t('app.curated-content-editor-empty-section-error'),
					type: 'alert'
				});
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
						data.error.forEach((error: CuratedContentValidationResponseErrorInterface)
							=> this.processValidationError(error.reason));
					} else {
						this.addAlert({
							message: i18n.t('app.curated-content-error-other'),
							type: 'alert'
						});
					}
				}
			})
			.catch((err: any): void => {
				Em.Logger.error(err);
				this.addAlert({
					message: i18n.t('app.curated-content-error-other'),
					type: 'alert'
				});
			})
			.finally((): void => this.hideLoader());
	},

	processValidationError(reason: string) {
		if (reason === 'itemsMissing') {
			this.addAlert({
				message: i18n.t('app.curated-content-editor-empty-section-error'),
				type: 'alert'
			});
		} else {
			// if other items occur that means user somehow bypassed validation of one or more items earlier
			this.addAlert({
				message: i18n.t('app.curated-content-editor-general-section-error'),
				type: 'alert'
			});
		}
	}
});
