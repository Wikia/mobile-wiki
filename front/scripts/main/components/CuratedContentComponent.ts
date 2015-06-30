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
			if (item.type) {
				this.trackClick('modular-main-page', `curated-content-item-${item.type}`);
				if (item.type === 'section' || item.type === 'category') {
					this.sendAction('openCuratedContentItem', item);
				}
			} else {
				this.trackClick('modular-main-page', 'curated-content-item-other');
			}

		}
	}
});
