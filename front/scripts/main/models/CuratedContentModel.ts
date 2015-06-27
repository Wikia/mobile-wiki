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

// TODO this probably shouldn't be empty
App.CuratedContentModel = Em.Object.extend();

App.CuratedContentModel.reopenClass({
	fetchItemsForSection: function (sectionName: string, sectionType = 'section'): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			var url = App.get('apiBase');
			url += (sectionType === 'section') ?
				//We don't need to wrap it into Try/Catch statement
				//See: https://github.com/Wikia/mercury/pull/946#issuecomment-113501147
				'/curatedContent/' + encodeURIComponent(sectionName) :
				'/category/' + encodeURIComponent(sectionName);

			Em.$.ajax({
				url: url,
				success: (data: any): void => {
					resolve(App.CuratedContentModel.sanitizeItems(data.items || []));
				},
				error: (data: any): void => {
					reject(data);
				}
			});
		});
	},

	sanitizeItems: function (rawData): CuratedContentItem[] {
		var sanitizedItems: CuratedContentItem[] = [];

		if (Em.isArray(rawData)) {
			sanitizedItems = rawData.map((item: any): CuratedContentItem => {
				return this.sanitizeItem(item);
			});
		}

		return sanitizedItems;
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
