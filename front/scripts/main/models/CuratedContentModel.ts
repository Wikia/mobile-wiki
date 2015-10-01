/// <reference path="../app.ts" />
'use strict';

interface CuratedContentItem {
	label: string;
	imageUrl: string;
	type: string;
	imageCrop?: {
		landscape: {
			x: number;
			y: number;
			width: number;
			height: number;
		};
		square: {
			x: number;
			y: number;
			width: number;
			height: number;
		};
	};
	url?: string;
	categoryName?: string;
	ns?: number;
}

App.CuratedContentModel = Em.Object.extend({
	title: null,
	type: null,
	items: [],
	offset: null
});

App.CuratedContentModel.reopenClass({
	find(title: string, type = 'section', offset: string = null): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			var url = App.get('apiBase') + '/main/',
				curatedContentGlobal: any = M.prop('curatedContent'),
				params: {offset?: string} = {},
				modelInstance = App.CuratedContentModel.create({
					title,
					type
				});

			// If this is first PV we have model for curated content already so we don't need to issue another request
			// When resolving promise we need to set Mercury.curatedContent to null
			// because this data gets outdated on following PVs
			if (curatedContentGlobal && curatedContentGlobal.items) {
				modelInstance.setProperties({
					items: App.CuratedContentModel.sanitizeItems(curatedContentGlobal.items),
					offset: curatedContentGlobal.offset
				});
				resolve(modelInstance);
				M.prop('curatedContent', null);
			} else {
				url += type + '/' + title;

				if (offset) {
					params.offset = offset;
				}

				Em.$.ajax(<JQueryAjaxSettings>{
					url,
					data: params,
					success: (data: any): void => {
						modelInstance.setProperties({
							items: App.CuratedContentModel.sanitizeItems(data.items),
							offset: data.offset || null
						});
						resolve(modelInstance);
					},
					error: (data: any): void => {
						reject(data);
					}
				});
			}
		});
	},

	loadMore(model: typeof App.CuratedContentModel): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			// Category type is hardcoded because only Categories API supports offset.
			var newModelPromise = App.CuratedContentModel.find(model.get('title'), 'category', model.get('offset'));

			newModelPromise
				.then(function (newModel: typeof App.CuratedContentModel): void {
					model.items.pushObjects(newModel.items);
					model.set('offset', newModel.offset);
					resolve(model);
				})
				.catch(function (reason: any): void {
					reject(reason);
				});
		});
	},

	sanitizeItems(rawData: any): CuratedContentItem[] {
		var sanitizedItems: CuratedContentItem[] = [];

		if (Em.isArray(rawData)) {
			sanitizedItems = rawData.map((item: any): CuratedContentItem => {
				return this.sanitizeItem(item);
			});
		}

		return sanitizedItems;
	},

	sanitizeItem(rawData: any): CuratedContentItem {
		var item: CuratedContentItem,
			categoryName: string,
			url: string,
			articlePath = Em.get(Mercury, 'wiki.articlePath');

		if (rawData.type === 'section') {
			item = {
				label: rawData.title,
				imageUrl: rawData.image_url,
				type: 'section'
			};
		} else if (rawData.type === 'category') {
			// MercuryApi (categories for section) returns article_local_url, ArticlesApi (subcategories) returns url
			url = rawData.url ? rawData.url : rawData.article_local_url;

			// TODO (CONCF-914): article_local_url is sometimes encoded and sometimes not, to investigate
			try {
				categoryName = decodeURIComponent(url);
			} catch (error) {
				categoryName = url;
			}

			// Remove /wiki/
			categoryName = categoryName.replace(articlePath, '');

			// Remove Category: prefix
			categoryName = categoryName.substr(categoryName.indexOf(':') + 1);

			item = {
				label: rawData.label || rawData.title,
				imageUrl: rawData.image_url,
				type: 'category',
				categoryName
			};
		} else {
			item = {
				label: rawData.title,
				imageUrl: rawData.thumbnail,
				type: rawData.type,
				url: rawData.url
			};

			// ArticlesApi doesn't return type for blog posts so we need to look at the namespace
			if (Em.isEmpty(rawData.type) && rawData.ns === 500) {
				item.type = 'blog';
			}
		}

		if (rawData.image_crop) {
			item.imageCrop = rawData.image_crop;
		}

		return item;
	}
});
