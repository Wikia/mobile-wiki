/// <reference path="../app.ts" />
'use strict';

interface CuratedContentEditorRawSectionInterface {
	label: string;
	image_id: number;
	node_type: string;
	items: CuratedContentEditorRawSectionInterface[]
	image_url?: string;
	featured?: string;
	type?: string;
}

App.CuratedContentEditorModel = Em.Object.extend({
	featured: null,
	curated: null,
	optional: null
});

App.CuratedContentEditorModel.reopenClass({
	load: function (): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			Em.$.ajax({
				url: M.buildUrl({
					path: '/wikia.php'
				}),
				data: {
					controller: 'CuratedContent',
					method: 'getData',
					format: 'json'
				},
				success: (data: any): void => {
					if (Em.isArray(data.data)) {
						resolve(App.CuratedContentEditorModel.sanitize(data.data));
					} else {
						reject('Invalid data was returned from Curated Content API');
					}
				},
				error: (data: any): void => {
					reject(data);
				}
			});
		});
	},

	/**
	 * @desc Accepts a raw object that comes from CuratedContent API and creates a model that we can use
	 *
	 * @param rawData
	 * @returns {any}
	 */
	sanitize: function (rawData: any): typeof App.CuratedContentEditorModel {
		var featured = {},
			curated = {
				items: <any>[]
			},
			optional = {};

		if (rawData.length) {
			rawData.forEach(function (section: CuratedContentEditorRawSectionInterface): void {
				if (section.featured === 'true') {
					featured = section;
				} else if (section.label === '') {
					optional = section;
				} else {
					curated.items.push(section);
				}
			});
		}

		return App.CuratedContentEditorModel.create({
			featured: featured,
			curated: curated,
			optional: optional
		});
	},

	getItem(
		parent: typeof App.CuratedContentEditorItemModel,
		itemLabel: string
	): typeof App.CuratedContentEditorItemModel {
		var item: typeof App.CuratedContentEditorItemModel = null;

		parent.items.some(function (itemObj: typeof App.CuratedContentEditorItemModel): boolean {
			if (itemObj.label === itemLabel) {
				item = App.CuratedContentEditorItemModel.createNew(itemObj);
				return true;
			}
		});

		return item;
	},

	addItem: function (
		parent: typeof App.CuratedContentEditorItemModel,
		newItem: typeof App.CuratedContentEditorItemModel
	): void {
		parent.items.push(newItem);
	},

	updateItem: function (
		parent: typeof App.CuratedContentEditorItemModel,
		newItem: typeof App.CuratedContentEditorItemModel,
		originalItemLabel: string
	): void {
		parent.items.forEach((
			item: typeof App.CuratedContentEditorItemModel,
			index: number,
			parentItems: typeof App.CuratedContentEditorItemModel[]
		): void => {
			if (item.label === originalItemLabel) {
				parentItems[index] = newItem;
			}
		})
	},

	deleteItem(
		parent: typeof App.CuratedContentEditorItemModel,
		itemLabel: string
	): void {
		parent.items.forEach((
				item: typeof App.CuratedContentEditorItemModel,
				index: number,
				parentItems: typeof App.CuratedContentEditorItemModel[]
			): void => {
			if (item.label === itemLabel) {
				parentItems.splice(index, 1);
			}
		});
	}
});
