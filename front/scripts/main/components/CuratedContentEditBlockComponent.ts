/// <reference path="../app.ts" />
'use strict';
interface CuratedContentEditBlockItemInterface {
	block: string;
	item: CuratedContentEditItemInterface
}

App.CuratedContentEditBlockComponent = Em.Component.extend({
	classNames: ['curated-content-edit-block'],
	tagName: 'section',

	actions: {
		editItem: function (item: CuratedContentEditItemInterface): void {
			var model = this.get('model');
			if (model.featured) {
				this.sendAction('editItem', {block: 'featured', item: item});
			} else {
				this.sendAction('editItem', item);
			}
		},

		openSection: function (item: CuratedContentEditItemInterface): void {
			this.sendAction('openSection', item);
		}
	}
});
