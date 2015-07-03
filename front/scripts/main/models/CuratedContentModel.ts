/// <reference path="../app.ts" />
'use strict';

interface CuratedContentItem {
	label: string;
	imageUrl: string;
	type: string;
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
	find: function (sectionName: string, sectionType = 'section', offset: string = null): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			var url = App.get('apiBase'),
				curatedContentGlobal: any = M.prop('curatedContent'),
				params: {offset?: string} = {},
				modelInstance = App.CuratedContentModel.create({
					title: sectionName,
					type: sectionType
				});

			// If this is first PV we have model for curated content already so we don't need to issue another request
			// When resolving promise we need to set Mercury.curatedContent to undefined
			// because this data gets outdated on following PVs
			if (curatedContentGlobal && curatedContentGlobal.items) {
				modelInstance.setProperties({
					items: App.CuratedContentModel.sanitizeItems(curatedContentGlobal.items),
					offset: curatedContentGlobal.offset
				});
				resolve(modelInstance);
				M.prop('curatedContent', null);
			} else {
				url += (sectionType === 'section') ?
					//We don't need to wrap it into Try/Catch statement
					//See: https://github.com/Wikia/mercury/pull/946#issuecomment-113501147
					'/curatedContent/' + encodeURIComponent(sectionName) :
					'/category/' + encodeURIComponent(sectionName);

				if (offset) {
					params.offset = offset;
				}

				Em.$.ajax({
					url: url,
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
			};

			// ArticlesApi doesn't return type for blog posts so we need to look at the namespace
			if (Em.isEmpty(rawData.type) && rawData.ns === 500) {
				item.type = 'blog';
			}
		}

		return item;
	}
});
