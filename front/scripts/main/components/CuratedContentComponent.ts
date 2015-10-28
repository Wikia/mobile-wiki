/// <reference path="../app.ts" />
/// <reference path="../mixins/TrackClickMixin.ts"/>
/// <reference path="../models/CuratedContentModel.ts"/>
'use strict';

App.CuratedContentComponent = Em.Component.extend(
	App.TrackClickMixin,
	{
		classNames: ['curated-content', 'mw-content'],

		actions: {
			/**
			 * @param {CuratedContentItem} item
			 * @returns {undefined}
			 */
			clickItem(item: CuratedContentItem): void {
				var itemType = item.type;
				if (itemType) {
					this.trackClick('modular-main-page', `curated-content-item-${itemType}`);
					if (itemType === 'section' || itemType === 'category') {
						this.sendAction('openCuratedContentItem', item);
					}
				} else {
					this.trackClick('modular-main-page', 'curated-content-item-other');
				}
			},

			/**
			 * @returns {undefined}
			 */
			loadMore(): void {
				this.set('isLoading', true);

				App.CuratedContentModel.loadMore(this.get('model'))
					.catch((reason: any): void => {
						this.controllerFor('application').addAlert({
							message: i18n.t('app.curated-content-error-load-more-items'),
							type: 'error'
						});
						Em.Logger.error(reason);
					})
					.finally((): void => {
						this.set('isLoading', false);
					});
			},
		},
	}
);
