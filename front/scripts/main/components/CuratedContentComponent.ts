/// <reference path="../app.ts" />
///<reference path="../mixins/LoadingSpinnerMixin.ts"/>
///<reference path="../mixins/TrackClickMixin.ts"/>
///<reference path="../models/CuratedContentModel.ts"/>
'use strict';

App.CuratedContentComponent = Em.Component.extend(App.LoadingSpinnerMixin, App.TrackClickMixin, {
	classNames: ['curated-content'],
	classNameBindings: ['showItems'],
	globalNavHeight: 57,
	spinnerDelay: 50,

	actions: {
		clickItem: function (item: CuratedContentItem): void {
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
		loadMore: function(): void {
			this.showLoader();
			// "category" type is hardcoded because only Categories API supports returning and accepting offset.
			// And only when offset is returned and set this action can be triggered.
			App.CuratedContentModel.fetchItemsForSection(this.get('title'), 'category', this.get('offset'))
				.then((data: any): void => {
					this.set('offset', data.offset);
					this.set('model', this.get('model').pushObjects(data.items));
				})
				.catch((reason: any): void => {
					this.controllerFor('application').addAlert('error', i18n.t('app.curated-content-error-load-more-items'));
					Em.Logger.error(reason);
				})
				.finally((): void => {
					this.hideLoader();
				});
		}
	}
});
