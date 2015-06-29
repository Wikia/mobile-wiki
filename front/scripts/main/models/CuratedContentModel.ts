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
					var itemy =
					[
							{
								title: "Category:Locationsdd",
								label: "Masteries",
								image_id: 438479,
								article_id: 2625,
								type: "category",
								image_url: "http://static.tomaszn.wikia-dev.com/__cb20150428141358/mlp/images/1/1c/Hamster-on-a-swing-big.jpg",
								article_local_url: "/wiki/Category:Locations"
							}
						]
					;
					resolve(App.CuratedContentModel.sanitizeItems(itemy || []));
				},
				error: (data: any): void => {
					reject(data);
				}
			});
		});
	},

	sanitizeItems: function (rawData: any): CuratedContentItem[] {
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
