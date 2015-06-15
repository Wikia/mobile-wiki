/// <reference path="../app.ts" />
'use strict';

interface CuratedContentSection {
	items: CuratedContentItem[];
	isTopSection?: boolean;
	label?: string;
}

interface CuratedContentItem {
	label: string;
	imageUrl: string;
	type: string;
	url?: string;
	categoryName?: string;
}

App.CuratedContentModel = Em.Object.extend({
	fetchItemsForSection: function (sectionName: string, sectionType = 'section'): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			var url = App.get('apiBase');
			url += (sectionType === 'section') ?
				'/curatedContent/' + sectionName :
				'/category/' + sectionName;

			Em.$.ajax({
				url: url,
				success: (data: any): void => {
					var sanitizedData: CuratedContentItem[] = [];

					if (data.items) {
						sanitizedData = data.items.map((item: any): CuratedContentItem => {
							return this.sanitizeItem(item);
						});
					}
					resolve(sanitizedData);
				},
				error: (data: any): void => {
					reject(data);
				}
			});
		});
	},

	sanitizeItem: function (rawData: any): CuratedContentItem {
		var item: CuratedContentItem;

		if (rawData.type === 'section') {
			item = {
				label: rawData.title,
				imageUrl: rawData.image_url,
				type: 'section'
			};
		} else if (rawData.type === 'category') {
			item = {
				label: rawData.label || rawData.title,
				imageUrl: rawData.image_url,
				type: 'category',
				categoryName: rawData.title
			}
		} else {
			item = {
				label: rawData.title,
				imageUrl: rawData.thumbnail,
				type: rawData.type,
				url: rawData.url
			}
		}

		return item;
	}
});
