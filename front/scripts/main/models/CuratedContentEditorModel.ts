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

type CuratedContentEditorModel = typeof App.CuratedContentEditorModel;

App.CuratedContentEditorModel = Em.Object.extend({
	featured: null,
	curated: null,
	optional: null
});

App.CuratedContentEditorModel.reopenClass({
	load(): Em.RSVP.Promise {
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
	sanitize(rawData: any): CuratedContentEditorItemModel {
		var featured = {
				items: <any>[]
			},
			curated = {
				items: <any>[]
			},
			optional = {
				items: <any>[]
			};

		if (rawData.length) {
			rawData.forEach((section: CuratedContentEditorRawSectionInterface): void => {
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

	getItem(parent: CuratedContentEditorItemModel, itemLabel: string): CuratedContentEditorItemModel {
		var item: CuratedContentEditorItemModel = null;

		parent.items.some((itemObj: CuratedContentEditorItemModel): boolean => {
			if (itemObj.label === itemLabel) {
				item = App.CuratedContentEditorItemModel.createNew(itemObj);
				return true;
			}
		});

		return item;
	},

	addItem(parent: CuratedContentEditorItemModel, newItem: CuratedContentEditorItemModel): void {
		parent.items.push(newItem);
	},

	updateItem(parent: CuratedContentEditorItemModel, newItem: CuratedContentEditorItemModel, itemLabel: string): void {
		parent.items.forEach((
			item: CuratedContentEditorItemModel,
			index: number,
			parentItems: CuratedContentEditorItemModel[]
		): void => {
			if (item.label === itemLabel) {
				parentItems[index] = newItem;
			}
		})
	},

	deleteItem(parent: CuratedContentEditorItemModel, itemLabel: string): void {
		parent.items = parent.items.filter((
				item: CuratedContentEditorItemModel
			): boolean => {
				return item.label !== itemLabel;
		});
	}
});
