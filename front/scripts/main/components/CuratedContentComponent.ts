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
			App.CuratedContentModel.fetchItemsForSection(this.get('title'), 'category', this.get('offset'))
			.then((data) => {
					this.set('offset', data.offset);
					var x = [].pushObjects(data.items);
					this.set('model', this.get('model').pushObjects(data.items));
					console.log(x);
			});
		}
	}
});
